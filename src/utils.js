// Add a node
function getNode(id) {
    if (!nodes[id]) {
        nodes[id] = { id: id };
    }
    return nodes[id];
}

// Parse each line of the SIF file
function parse(line, i) {
    const source = getNode(line[0]);
    const interaction = line[1] ? line[1] : "";

    line = line.split("\t").length > 1 ? line.split("\t") : line.split(" ");

    if (line.length && line.length > 0 && line[0] !== "") {
        if (interaction !== "") {
            // Get all the target nodes for a source
            for (let j = 2; j < line.length; j++) {
                if (line[j] !== "") {
                    // Create an object for each target for the source
                    const target = getNode(line[j]);

                    const relation_object = {
                        target: target.id,
                        source: source.id,
                        id: source.id + target.id,
                        // Replace quotes in relation
                        relation: interaction.replace(/[''""]+/g, ""),
                    };

                    if (source < target) {
                        links[source.id + target.id + interaction] = relation_object;
                    } else {
                        links[target.id + source.id + interaction] = relation_object;
                    }
                }
            }
        }
        // Handle the case of single node i.e. no relation with any other node
        // and only the source exists
        else {
            links[source.id] = { target: "", source: source.id, id: source.id, relation: "" };
        }
    }
}

// Convert to array from objects
function toArr(obj) {
    const arr = [];

    for (const key in obj) {
        arr.push(obj[key]);
    }

    return arr;
}

// Make content from list of nodes and links
function toDataArr(nodes, links) {
    const content = [];

    // Make a list of all nodes
    for (let i = 0; i < nodes.length; i++) {
        content.push({ data: nodes[i] });
    }

    // Make a list of all relationships among nodes
    for (let i = 0; i < links.length; i++) {
        content.push({ data: links[i] });
    }

    return content;
}

export function parse_sif(text) {
    // Private variables and methods
    const nodes = {};
    const links = {};

    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
        if (lines[i] !== "") {
            parse(lines[i], i);
        }
    }

    const parsed = {
        content: toDataArr(toArr(nodes), toArr(links)),
    };

    return parsed;
}

export function runSearchAlgorithm(cytoscape, root_id, type, self) {
    let algorithm = "";
    let i = 0;

    function selectNextElement() {
        if (i < algorithm.path.length) {
            // Add css class for the selected edge(s)
            algorithm.path[i].addClass("searchpath");
            i++;
            // Animate the edges and nodes coloring
            // of the path with a delay of 500ms
            setTimeout(selectNextElement, 500);
        }
    }

    switch (type) {
        // Breadth First Search
        case "bfs":
            algorithm = cytoscape.elements().bfs("#" + root_id, function () {}, true);
            selectNextElement();
            break;
        // Depth First Search
        case "dfs":
            algorithm = cytoscape.elements().dfs("#" + root_id, function () {}, true);
            selectNextElement();
            break;
        // A* search
        case "astar":
            // Choose root and destination for performing A*
            if (!self.astar_root) {
                self.astar_root = root_id;
            } else {
                self.astar_destination = root_id;
            }
            if (self.astar_root && self.astar_destination) {
                algorithm = cytoscape
                    .elements()
                    .aStar({ root: "#" + self.astar_root, goal: "#" + self.astar_destination }, function () {}, true);
                selectNextElement();
            }
        default:
            return;
    }
}

export function runTraversalType(cytoscape, root_id, type) {
    let node_collection;

    switch (type) {
        // Recursively get edges (and their sources) coming into the nodes in a collection
        case "predecessors":
            node_collection = cytoscape.$("#" + root_id).predecessors();
            break;
        // Recursively get edges (and their targets) coming out of the nodes in a collection
        case "successors":
            node_collection = cytoscape.$("#" + root_id).successors();
            break;
        // Get edges (and their targets) coming out of the nodes in a collection.
        case "outgoers":
            node_collection = cytoscape.$("#" + root_id).outgoers();
            break;
        // Get edges (and their sources) coming into the nodes in a collection.
        case "incomers":
            node_collection = cytoscape.$("#" + root_id).incomers();
            break;
        // From the set of calling nodes, get the nodes which are roots
        case "roots":
            node_collection = cytoscape.$("#" + root_id).roots();
            break;
        // From the set of calling nodes, get the nodes which are leaves
        case "leaves":
            node_collection = cytoscape.$("#" + root_id).leaves();
            break;
        default:
            return;
    }

    // Add CSS class for selected nodes and edges
    node_collection.edges().addClass("searchpath");
    node_collection.nodes().addClass("searchpath");
}

export function styleGenerator(settings) {
    return [
        {
            selector: "node",
            style: {
                "background-color": settings.color_picker_nodes,
                opacity: 1,
                content: "data(id)",
                "text-valign": "center",
            },
        },
        {
            selector: "core",
            style: {
                "selection-box-color": "#AAD8FF",
                "selection-box-border-color": "#8BB0D0",
                "selection-box-opacity": "0.5",
            },
        },
        {
            selector: "edge",
            style: {
                "curve-style": settings.curve_style,
                "haystack-radius": 0,
                width: 3,
                opacity: 1,
                "line-color": settings.color_picker_edges,
                "target-arrow-shape": settings.directed,
                "overlay-padding": "3px",
            },
        },
        {
            selector: "node:selected",
            style: {
                "border-width": "6px",
                "border-color": "#AAD8FF",
                "border-opacity": "0.5",
                "background-color": "#77828C",
                "text-outline-color": "#77828C",
            },
        },
        {
            selector: ".searchpath",
            style: {
                "background-color": settings.color_picker_highlighted,
                "line-color": settings.color_picker_highlighted,
                "target-arrow-color": settings.color_picker_highlighted,
                "transition-property": "background-color, line-color, target-arrow-color",
                "transition-duration": "0.5s",
            },
        },
    ];
}
