import { parseSIF } from "./utils";

test("parseSIF", () => {
    const text = "A\tppi\tB\nB\tppi\tC\nC\tppi\tD\n";
    const parsed = parseSIF(text);
    const expected = {
        content: [
            { data: { id: "A" } },
            { data: { id: "B" } },
            { data: { id: "C" } },
            { data: { id: "D" } },
            { data: { target: "B", source: "A", id: "AB", relation: "ppi" } },
            { data: { target: "C", source: "B", id: "BC", relation: "ppi" } },
            { data: { target: "D", source: "C", id: "CD", relation: "ppi" } },
        ],
    };

    expect(parsed).toEqual(expected);
});

