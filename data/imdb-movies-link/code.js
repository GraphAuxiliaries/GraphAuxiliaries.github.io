const width = 1000
const height = 500

const links = data.links.map((l) => ({ ...l }))
const nodes = data.nodes.map((n) => ({ ...n }))

const layoutPosition = {
    33306: { x: 797.5006270600743, y: 28.17430427526426 },
    36475: { x: 622.9324391266373, y: 56.6751305089939 },
    39779: { x: 748.8738951220566, y: 135.29736603043648 },
    43935: { x: 634.88200350241, y: 160.5143164140825 },
    48078: { x: 522.0248556531988, y: 216.54082224854426 },
    48754: { x: 699.6565283874006, y: 262.55285742621265 },
    50294: { x: 345.4899464779546, y: 416.0628082596454 },
    57234: { x: 390.64961062391285, y: 282.27874301525617 },
    57475: { x: 518.9432018083098, y: 359.1965296475362 },
    76459: { x: 185.30035672427516, y: 427.49130203103846 },
    81088: { x: 56.01164410842375, y: 385.84830544935244 },
}

const attributesInfo = {
    avg_vote_diff: { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
    votes_diff: { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
    duration_diff: { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
    budget_diff: { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
}
const attributes = [
    "avg_vote_diff",
    "votes_diff",
    "duration_diff",
    "budget_diff",
]

const updateInfo = (info, attr, link) => {
    info[attr].max = Math.max(info[attr].max, link[attr])
    info[attr].min = Math.min(info[attr].min, link[attr])
}

data.links.forEach((l) => {
    attributes.forEach((attr) => {
        updateInfo(attributesInfo, attr, l)
    })
})

const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
]

const SVG_NS = "http://www.w3.org/2000/svg"
const svg = document.createElementNS(SVG_NS, "svg")
svg.setAttribute("viewBox", [0, 0, width, height])
svg.setAttribute("width", width)
svg.setAttribute("height", height)

const nodeID2node = {}
nodes.forEach((node) => {
    nodeID2node[node.id] = node
    node.x = layoutPosition[node.id].x
    node.y = layoutPosition[node.id].y
})

const linksGroup = document.createElementNS(SVG_NS, "g")
svg.appendChild(linksGroup)
links.forEach((link) => {
    const x1 = nodeID2node[link.source].x
    const x2 = nodeID2node[link.target].x
    const y1 = nodeID2node[link.source].y
    const y2 = nodeID2node[link.target].y
    const line = document.createElementNS(SVG_NS, "line")
    linksGroup.appendChild(line)
    line.setAttribute("stroke", "#999")
    line.setAttribute("stroke-opacity", 0.6)
    line.setAttribute("stroke-width", link.common_actors)
    line.setAttribute("x1", x1)
    line.setAttribute("y1", y1)
    line.setAttribute("x2", x2)
    line.setAttribute("y2", y2)

    const linkGroup = document.createElementNS(SVG_NS, "g")
    linksGroup.appendChild(linkGroup)

    // source target
    const midpoint = {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2,
    }
    let theta = 0
    if (x2 == x1) {
        theta = 90
    } else {
        theta = (Math.atan((y2 - y1) / (x2 - x1)) / Math.PI) * 180 // clock-wise
    }
    if (y2 < y1) {
        theta += 180
    }
    linkGroup.setAttribute(
        "transform",
        `translate(${midpoint.x}, ${midpoint.y})rotate(${theta})`
    )

    // four rects: avg_vote_diff, votes_diff,duration_diff,budget_diff,date_diff
    const backgroundColor = ["#abf483", "#a6d3f6", "#f5f5a5", "#f5cfd1"]
    const barColor = ["#1a7903", "#002cfe", "#fffc00", "#fa000b"]
    const totalWidth = 90
    const height = 20
    const width = 18
    attributes.forEach((attr, i) => {
        const rect = document.createElementNS(SVG_NS, "rect")
        linkGroup.appendChild(rect)
        rect.setAttribute("y", -height / 2)
        // rect.setAttribute("y", (-totalWidth / 2) + i * totalWidth / 4)
        rect.setAttribute("x", -totalWidth / 2 + (i * totalWidth) / 4)
        rect.setAttribute("width", width)
        rect.setAttribute("height", height)
        rect.setAttribute("stroke-width", 1)
        rect.setAttribute("stroke", "#000000")
        rect.setAttribute("fill", backgroundColor[i])

        const attrValue =
            (link[attr] - attributesInfo[attr].min) /
            (attributesInfo[attr].max - attributesInfo[attr].min)
        // console.log(attrValue)
        const barRect = document.createElementNS(SVG_NS, "rect")
        linkGroup.appendChild(barRect)
        barRect.setAttribute("y", -height / 3)
        // rect.setAttribute("y", (-totalWidth / 2) + i * totalWidth / 4)
        barRect.setAttribute("x", -totalWidth / 2 + (i * totalWidth) / 4)
        barRect.setAttribute("width", attrValue * width + 1)
        barRect.setAttribute("height", (height * 2) / 3)
        barRect.setAttribute("stroke-width", 1)
        barRect.setAttribute("stroke", "#000000")
        barRect.setAttribute("fill", barColor[i])
    })
})

const nodesGroup = document.createElementNS(SVG_NS, "g")
svg.appendChild(nodesGroup)
nodes.forEach((node) => {
    const circle = document.createElementNS(SVG_NS, "circle")
    nodesGroup.appendChild(circle)
    circle.setAttribute("stroke", "#fff")
    circle.setAttribute("stroke-width", 1.5)
    circle.setAttribute("r", parseFloat(node.avg_vote))

    circle.setAttribute("fill", "#aaa")

    circle.setAttribute("cx", node.x)
    circle.setAttribute("cy", node.y)

    const title = document.createElementNS(SVG_NS, "title")
    title.textContent = `${node.title} (vote:${node.avg_vote})`
    circle.appendChild(title)
})

return svg
