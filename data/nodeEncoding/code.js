const width = 800
const height = 600

const colors = {
    A: "#ffffff",
    B: "#f9f39c",
    C: "#f8cacc",
    D: "#d2ecf2",
}

var svg = d3
    .create("svg")
    .attr("width", width) //设定宽度
    .attr("height", height) //设定高度

const lines = svg
    .append("g")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("x1", function (d, i) {
        return data.nodes[d.source].x
    }) //每个矩形的起始x坐标
    .attr("y1", function (d, i) {
        return data.nodes[d.source].y
    })
    .attr("x2", function (d, i) {
        return data.nodes[d.target].x
    })
    .attr("y2", function (d, i) {
        return data.nodes[d.target].y
    })
    .attr("stroke", "#000000")
    .attr("stroke-dasharray", function (d, i) {
        return d.direct ? "" : "5,5"
    }) //dashed array for line
    .attr("stroke-width", "3")

//画节点
let nodes = svg
    .append("g")
    .selectAll("rect")
    .data(data.nodes)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
        return d.x - d.width / 2
    }) //每个矩形的起始x坐标
    .attr("y", function (d, i) {
        //每个矩形的起始y坐标
        return d.y - d.height / 2
    })
    .attr("height", function (d, i) {
        //每个矩形的高度
        return d.height
    })
    .attr("width", (d) => d.width) //每个矩形的宽度
    .attr("fill", function (d, i) {
        //每个矩形的起始y坐标
        return colors[d.type]
    })
    .attr("stroke", "#000000")
    .attr("stroke-width", "3")

let texts = svg
    .append("g")
    .selectAll("text")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
        return d.x
    })
    .attr("y", function (d, i) {
        return d.y - 30
    })
    .text(function (d, i) {
        return d.name
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "hanging")

    .attr("fill", "#000000")

const xScale = d3.scaleLinear().domain([0, 7]).range([0, 50])

const yScale = d3.scaleLinear().domain([0, 1]).range([30, 0])
const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d))

const linecharts = svg
    .append("g")
    .selectAll("g")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
        var newPosX = d.x - d.width / 2 + 15
        var newPosY = d.y - d.height / 2 + 30
        return "translate(" + newPosX + "," + newPosY + ")"
    })
    .selectAll("line")
    .data((d) => {
        const arr = d.trends
        const pos = arr.map((t, i) => {
            return {
                x: xScale(i),
                y: yScale(t),
            }
        })

        const links = []
        for (let i = 0; i < pos.length - 1; i++) {
            links.push({
                source: pos[i],
                target: pos[i + 1],
            })
        }
        return links
    })
    .enter()
    .append("line")
    .attr("x1", (d) => d.source.x) //每个矩形的起始x坐标
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y)
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")

return svg.node()
