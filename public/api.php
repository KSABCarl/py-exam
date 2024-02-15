<?php

require 'rb-sqlite.php';
require 'functions.php';
R::setup('sqlite:dbfile.db');

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');

date_default_timezone_set('Europe/Stockholm');

function response($data)
{
    R::close();
    die($data);
}

if (isset($_GET['id'])) {
    $work = R::findOne('work', ' uid = ? ', [$_GET['id']]);
    if (!$work) {
        response('false');
    }

    $exam = file_get_contents('exams/' . $work->code . '.json');
    $data = json_decode($exam, true);
    $result = R::findOne('result', ' session = ? ', [$work->uid]);
    if ($result) {
        $data['submitted'] = true;
    } else {
        $data['submitted'] = false;
    }

    $now = time();
    if ($work->email == 'carl.holmberg@kunskapsgymnasiet.se') {
        response(json_encode($data));
    }
    if (strtotime($data['dateFrom']) < $now && strtotime($data['dateTo']) > $now) {
        response(json_encode($data));
    }

    response('false');

} else if (isset($_GET['exam'])) {
    $data = parseToken();
    if (!$data) {
        response('false');
    }

    $email = $data['email'];
    $name = $data['name'];
    $baseGroup = array_key_exists('baseGroup', $data) ? $data['baseGroup'] : '-';

    $work = R::findOne('work', ' email = ? AND code = ? ', [$email, $_GET['exam']]);
    if ($work) {
        response($work->uid);
    } else {
        $work = R::dispense('work');
        $work->name = $name;
        $work->email = $email;
        $work->class = $baseGroup;
        $work->uid = guidv4();
        $work->code = $_GET['exam'];

        R::store($work);
        response($work->uid);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload = getPayload();
    $d = date('Y-m-d H:i:s');

    if ($payload['action'] === 'progress') {
        $progress = R::dispense('progress');
        $progress->date = $d;
        $progress->data = $payload['data'];
        $progress->session = $payload['session'];
        R::store($progress);
    } else if ($payload['action'] === 'submit') {
        $session = $payload['session'];
        $result = R::dispense('result');
        $result->date = $d;
        $result->session = $session;
        $result->exam = json_encode($payload['exam']);
        if ($payload['images']) {
            foreach ($payload['images'] as $img) {
                file_force_contents('images/' . $session . '/' . $img['id'] . '.svg', $img['value']);
            }
        }
        R::store($result);
    }
    response('true');
}


/*

R::close();


function isBanned($ip, $email)
{
    $users = R::find('user', ' ip = :ip AND email = :email', [':ip' => $ip, ':email' => $email]);
    if ($users) {
        return true;
    }
    return false;
}

function add($data)
{
    // Store message
    $ip = getIp();
    if (isBanned($ip, $data['email'])) {
        return array('error' => 'user-is-banned');
    }
    $msg = R::dispense('message');
    $msg->qIp = getIp();
    $msg->qFrom = $data['name'];
    $msg->qEmail = $data['email'];
    $msg->qTs = time()*1000;
    $msg->qText = $data['msg'];

    $msg->published = false;

    $id = R::store($msg);
    if ($id) {
        return $msg;
    }
    return false;
}

function read($admin=false)
{
    // Read messages
    if ($admin) {
        return R::find('message');
    }
    return R::find('message', ' is_published = 1 ORDER BY q_ts ');
}

$reply = array('success' => false);

if (isset($_GET['me'])) {
}

if (isset($_GET['msgs']) || isset($_GET['all'])) {
    // Retrieve all messages
    $beans = read(isset($_GET['all']));
    if ($beans) {
        $banned = R::find('user');
        if ($banned) {
            $beans = array_map(function ($msg) use ($banned) {
                foreach ($banned as $user) {
                    if ($msg['q_ip'] == $user->ip && $msg['q_email'] == $user->email) {
                        $msg['is_banned'] = true;
                    }
                }
                return $msg;
            }, exportWithBool($beans));
        } else {
            $beans = exportWithBool($beans);
        }
        if (isset($_GET['all'])) {
            $reply = generateResponse(true, $beans);
        } else {
            $msgs = array_map(function ($msg) {
                unset($msg['ip'], $msg['q_email']);
                return $msg;
            }, $beans);
            
            $reply = generateResponse(true, $msgs);
        }
    } else {
        $reply = generateResponse(true, []);
    }
} else {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $payload = json_decode(file_get_contents('php://input'), true);
            if ($payload['action']) {
                // check credentials!
                $action = $payload['action'];
                $data = $payload['data'];
                // delete
                // ban/unban
                // show
                // hide
                // flag (toggle)
                if ($data['id']) {
                    $msg = R::load('message', $data['id']);
                } else {
                    $msg = false;
                }
    
                switch ($action) {
                    case 'send':
                        if (!$msg && ($data['email'] && $data['name'] && $data['msg'])) {
                            $added = add($data);
                            if ($added) {
                                if ($added['error']) {
                                    $reply = generateResponse(false, $added['error']);
                                } else {
                                    $reply = generateResponse(true, exportWithBool($added));
                                }
                            }
                        }
                    break;
                    case 'reply':
                        if ($msg) {
                            $msg->rTs = time()*1000;
                            $msg->rText = $data['msg'];
                            $msg->isPublished = true;
                            R::store($msg);
                            $reply = generateResponse(true, exportWithBool($msg));
                        }
                    break;
                    case 'delete':
                        R::trash($msg);
                        $reply = generateResponse(true);
                     break;
                    case 'ban':
                        $msg->isPublished = false;
                        $user = R::dispense('user');
                        $user->ip = $msg->qIp;
                        $user->email = $msg->qEmail;
                        R::store($user);
                        R::store($msg);
                        $msg->isPublished = false;
                        $reply = generateResponse(true, array('user' => exportWithBool($user), 'msg' => exportWithBool($msg)));
                    break;
                    case 'unban':
                        $user = R::findOne('user', ' ip = :ip AND email = :email', [':ip' => $msg->qIp, ':email' => $msg->qEmail]);
                        R::trash($user);
                        $reply = generateResponse(true, exportWithBool($msg));
                    break;
                    case 'show':
                        $msg->isPublished = true;
                        R::store($msg);
                        $reply = generateResponse(true, exportWithBool($msg));
                    break;
                    case 'hide':
                        $msg->isPublished = false;
                        R::store($msg);
                        $reply = generateResponse(true, exportWithBool($msg));
                    break;
    
                    case 'flag':
                        $msg->isFlagged = $msg->isFlagged? false : true;
                        R::store($msg);
                        $reply = generateResponse(true, exportWithBool($msg));
                    break;
    
                }
            }
        } catch (\Throwable $th) {
            //
        }
    }
}

function exportWithBool($bean)
{
    if (is_array($bean)) {
        $beans = R::exportAll($bean);
        $data = array_map('convertBools', $beans);
    } else {
        $data = convertBools($bean->export());
    }
    return $data;
}

function convertBools($arr)
{
    foreach ($arr as $key => $val) {
        if (substr($key, 0, 2) == 'is') {
            $arr[$key] = boolval($val);
        }
    }
    return $arr;
}

function generateResponse($success, $data=false)
{
    $reply = array(
        'success' => $success,
        'data' => $data? $data : []
    );
    return $reply;
}

R::close();

echo json_encode($reply);
*/