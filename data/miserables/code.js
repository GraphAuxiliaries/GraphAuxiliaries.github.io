const width = 800
const height = 600

const id2node = new Map()
const nodes = data.nodes.map((d) => {
    const n = d
    id2node.set(d.id, n)
    return n
})

const links = data.links.map((d) => ({
    value: d.value,
    source: id2node.get(d.source),
    target: id2node.get(d.target),
}))

const colors = d3.schemeCategory10

const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)

const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value))

const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("g")
    .each(function (d) {
        const g = d3.select(this)
        const size = [20, 20]
        const percents = d.percents
        const group = d.group
        g.append("rect")
            .attr("x", -size[0] / 2)
            .attr("y", -size[1] / 2)
            .attr("width", size[0])
            .attr("height", size[1])
            .attr("fill", colors[group])
            .attr("stroke-width", 1)
        if (group % 2) {
            g.selectAll("rect.percents")
                .data(percents)
                .enter()
                .append("rect")
                .classed("percents", true)
                .attr("x", -size[0] / 2)
                .attr("y", (d, i) => {
                    return (
                        (d3.sum(percents.slice(0, i)) / 100) * size[1] -
                        size[1] / 2
                    )
                })
                .attr("width", size[0])
                .attr("height", (d) => {
                    const height = size[1] * (d / 100)
                    return height
                })
                .attr("fill", (_, i) => colors[i])
                .attr("stroke-width", 1)
        } else {
            g.selectAll("ellipse.percents")
                .data(percents)
                .enter()
                .append("ellipse")
                .classed("percents", true)
                .attr("cx", 0)
                .attr("cy", (d, i) => {
                    return (
                        (d3.sum(percents.slice(0, i)) / 100) * size[1] -
                        size[1] / 2 +
                        (size[1] * (d / 100)) / 2
                    )
                })
                .attr("rx", size[0] / 2)
                .attr("ry", (d) => {
                    const height = size[1] * (d / 100)
                    return height / 2
                })
                .attr("fill", (_, i) => colors[i])
                .attr("stroke-width", 1)
        }
    })

node.append("title").text((d) => d.id)

link.attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y)

node.attr("transform", (d) => `translate(${d.x}, ${d.y})`)

return svg.node()
