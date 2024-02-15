import uuid

csstemplate = """
<style>

#%id% .s7w {
  display: flex;
  gap: %gap%px;
}

#%id% .s7s {
  display: inline-grid;
  width: %size%px;
  height: %height%px;
  grid-template-columns: %unit%px %len%px %unit%px;
  grid-template-rows: %unit%px %len%px %unit%px %len%px %unit%px;
  gap: %offset%px;
}

#%id% .s7s div {
  background-color: rgba(0 0 0 / 0.1);
  box-shadow: inset %inset%px %inset%px %inset%px rgba(0 0 0 /0.1);
  border-radius: %unit%px;
  margin: -%offset%px;
}

.s7s .d1 {
  grid-row: 2;
  grid-column: 1;
}

.s7s .d2 {
  grid-row: 4;
  grid-column: 1;
}

.s7s .d3 {
  grid-row: 1;
  grid-column: 2;
}

.s7s .d4 {
  grid-row: 3;
  grid-column: 2;
}

.s7s .d5 {
  grid-row: 5;
  grid-column: 2;
}

.s7s .d6 {
  grid-row: 2;
  grid-column: 3;
}

.s7s .d7 {
  grid-row: 4;
  grid-column: 3;
}

#%id% .s7s .on {
  background-color: %color%;
  box-shadow: inset %inset%px %inset%px %inset%px rgba(0 0 0 /0.1), 0 0 %unit%px %color%;
}
</style>
"""


def css(color, size, id):
    unit = size / 8
    gap = unit * 2
    length = size - gap
    height = size * 2
    offset = unit / 5
    inset = offset * 2

    return (
        csstemplate.replace("%color%", color)
        .replace("%size%", str(size))
        .replace("%unit%", str(unit))
        .replace("%gap%", str(gap))
        .replace("%len%", str(length))
        .replace("%height%", str(height))
        .replace("%offset%", str(offset))
        .replace("%inset%", str(inset))
        .replace("%id%", id)
    )


def segment(vals):
    if len(vals) != 7:
        raise ValueError("Segment needs to be exacty 7 characters")
    if vals.replace("1", "").replace("0", "") != "":
        raise ValueError("Segments may only include 1 and 0")

    html = ""
    for i in range(1, 8):
        if vals[i - 1] == "1":
            html += f"<div class='d{i} on'></div>"
        else:
            html += f"<div class='d{i}'></div>"

    return f"<div class='s7s'>{html}</div>"


def row(segments, id):
    html = ""
    for seg in segments:
        html += segment(seg)
    return f"<div id='{id}'><div class='s7w'>{html}</div></div>"


def display(segments, color="red", size=40):
    """<pre>
    <strong>Documentation:</strong>
    Send the segments to the s7d panel.
    color can be set to any valid css named color, like red (default),
      blue, green, aquamarine, teal etc.
    size can be set to any amount of pixels wide (40px default)

    <em>Setting color and size are developmental purposes only and should
      ideally be set to the dimensions and color of the actual s7d:s used.
    If a s7d is not detected a visual representation of the output is sent
      to stdout.</em>

    Multiple calls to display() will cycle through available s7d paneels
      giving multiple rows of output depending on configuration. In
      development mode there is no limit to rows generated to stdout.

    <strong>Example:</strong>
    display(['0000011', '0111110', '0011111', '1001011', '1011101'])
    -> outputs the digits 1 2 3 4 5 to the display.

    <strong>Common use:</strong>
    Most commonly a function and a dictionary is used to convert characters
      or command sequences to 7-segment representations, i.e.:

    charMap = {
      0: '1110111',
      1: '0000011',
      2: '0111110',
      3: '0011111',
      4: '1001011',
      5: '1011101'
    }

    def encode_number(num):
      msg = []
      for n in str(num):
        msg.append(charMap.get(int(n), '000-000'))
      return msg

    display(encode_number(42))
    </pre>
    """
    if len(segments) > 10:
        raise SyntaxError(f"Max segments are 10. {len(segments)} given.")

    for i in range(10 - len(segments)):
        segments.append("0000000")

    id = f"id-{uuid.uuid1().hex}"
    html = row(segments, id)
    print(f"{css(color, size, id)}{html}")


if __name__ == "__main__":
    display(
        [
            "1111111",
            "0101010",
        ]
    )
    help(display)
