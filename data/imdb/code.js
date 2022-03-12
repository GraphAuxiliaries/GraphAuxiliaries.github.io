const width = 1000
const height = 800
const links = data.links
const nodes = data.nodes

const colors = d3.schemeCategory10

const svg = d3.create("svg").attr("viewBox", [0, 0, width, height])

const nodeID2node = {}
const budgetRange = { min: Infinity, max: -Infinity }
const incomeRange = { min: Infinity, max: -Infinity }
data.nodes.forEach((node) => {
    nodeID2node[node.id] = node
    incomeRange.min = Math.min(node.worlwide_gross_income, incomeRange.min)
    incomeRange.max = Math.max(node.worlwide_gross_income, incomeRange.max)
    budgetRange.min = Math.min(node.budget, budgetRange.min)
    budgetRange.max = Math.max(node.budget, budgetRange.max)
})

data.nodes.forEach((node) => {
    node.x =
        Math.sqrt(
            (node.budget - budgetRange.min + 1) /
                (budgetRange.max - budgetRange.min + 1)
        ) *
            width *
            0.8 +
        width * 0.1
    node.y =
        Math.sqrt(
            (node.worlwide_gross_income - incomeRange.min + 1) /
                (incomeRange.max - incomeRange.min + 1)
        ) *
            height *
            0.8 +
        height * 0.1
})

const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => d.common_genre)
    .attr("x1", (d) => nodeID2node[d.source].x)
    .attr("y1", (d) => nodeID2node[d.source].y)
    .attr("x2", (d) => nodeID2node[d.target].x)
    .attr("y2", (d) => nodeID2node[d.target].y)

const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 8)
    .attr("fill", (d) => {
        const month = d.date_published.split("-")[1]
        const season = Math.floor(month / 4)
        return colors[season]
    })
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)

node.append("title").text((d) => d.title)

return svg.node()
