const width = 500
const height = 400
const links = data.links
const nodes = data.nodes

const colors = [
    "#d62728",
    "#1f77b4",
    "#ff7f0e",
    "#9467bd",
    "#2ca02c",
    "#8c564b",
    "#bcbd22",
    "#17becf",
    "#7f7f7f",
    "#e377c2",
]

const createSVGElement = (name) => {
    return document.createElementNS("http://www.w3.org/2000/svg", name)
}

const svg = createSVGElement("svg")
svg.setAttribute("viewBox", [0, 0, width, height])
svg.setAttribute("width", width)
svg.setAttribute("height", height)

const nodeID2node = {}
const votesRange = { min: Infinity, max: -Infinity }
const avgVoteRange = { min: Infinity, max: -Infinity }
nodes.forEach((node) => {
    nodeID2node[node.id] = node
    votesRange.min = Math.min(node.year, votesRange.min)
    votesRange.max = Math.max(node.year, votesRange.max)
    avgVoteRange.min = Math.min(node.duration, avgVoteRange.min)
    avgVoteRange.max = Math.max(node.duration, avgVoteRange.max)
})
nodes.forEach((node) => {
    node.x =
        ((node.year - votesRange.min) / (votesRange.max - votesRange.min)) *
            width *
            0.8 +
        0.1 * width
    node.y =
        ((node.duration - avgVoteRange.min) /
            (avgVoteRange.max - avgVoteRange.min)) *
            height *
            0.8 +
        0.1 * height
})

const linkGroup = createSVGElement("g")
linkGroup.setAttribute("stroke", "#999")
linkGroup.setAttribute("stroke-opacity", 0.6)

svg.appendChild(linkGroup)

links.forEach((link) => {
    const line = createSVGElement("line")
    linkGroup.appendChild(line)
    line.setAttribute("stroke-width", link.common_actors)
    line.setAttribute("x1", nodeID2node[link.source].x)
    line.setAttribute("y1", nodeID2node[link.source].y)
    line.setAttribute("x2", nodeID2node[link.target].x)
    line.setAttribute("y2", nodeID2node[link.target].y)
})

const nodeGroup = createSVGElement("g")
nodeGroup.setAttribute("stroke", "#fff")
nodeGroup.setAttribute("stroke-width", 1.5)
svg.appendChild(nodeGroup)

const mainGenres = [...new Set(nodes.map((node) => node.genre[0]))].sort()

nodes.forEach((node) => {
    const fill = colors[mainGenres.indexOf(node.genre[0])]
    const size = Math.log2(node.votes) * 2
    if (node.country === "Italy") {
        const rect = createSVGElement("rect")
        nodeGroup.appendChild(rect)
        rect.setAttribute("width", size)
        rect.setAttribute("height", size)
        rect.setAttribute("fill", fill)
        rect.setAttribute(
            "transform",
            `translate(${node.x - size / 2}, ${node.y - size / 2})`
        )
    } else {
        const circle = createSVGElement("circle")
        nodeGroup.appendChild(circle)
        circle.setAttribute("r", size / 2)
        circle.setAttribute("fill", fill)
        circle.setAttribute("cx", node.x)
        circle.setAttribute("cy", node.y)
    }
})

return svg
