import { afterEach, beforeEach, vi } from "vitest";
import { parseSIF, runSearchAlgorithm } from "./utils";

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    vi.restoreAllMocks();
});

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

test("runSearchAlgorithm", () => {
    const cytoscape = {
        elements: vi.fn().mockReturnValue({
            bfs: vi.fn().mockReturnValue({
                path: [{ addClass: vi.fn() }, { addClass: vi.fn() }, { addClass: vi.fn() }],
            }),
            dfs: vi.fn().mockReturnValue({
                path: [{ addClass: vi.fn() }, { addClass: vi.fn() }, { addClass: vi.fn() }],
            }),
            aStar: vi.fn().mockReturnValue({
                path: [{ addClass: vi.fn() }, { addClass: vi.fn() }, { addClass: vi.fn() }],
            }),
        }),
    };
    const rootId = "A";
    const type = "bfs";
    const self = { cytoscape: cytoscape };
    runSearchAlgorithm(cytoscape, rootId, type, self);

    vi.runAllTimers();

    const path = cytoscape.elements().bfs().path;
    path.forEach((element) => {
        expect(element.addClass).toHaveBeenCalledWith("searchpath");
    });
});
