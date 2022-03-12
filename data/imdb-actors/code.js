const width = 600
const height = 300

const svg = d3
    .create("svg")
    .attr("width", width) //设定宽度
    .attr("height", height) //设定高度

const id2node = {}
const size = 40
const votesRange = { min: Infinity, max: -Infinity }
const avgVoteRange = { min: Infinity, max: -Infinity }
data.nodes.forEach((node) => {
    id2node[node.id] = node
    votesRange.min = Math.min(votesRange.min, node.votes)
    votesRange.max = Math.max(votesRange.max, node.votes)
    avgVoteRange.min = Math.min(avgVoteRange.min, node.avg_vote)
    avgVoteRange.max = Math.max(avgVoteRange.max, node.avg_vote)
    node.size = size
})

const xScale = d3
    .scaleLinear()
    .domain([0, data.nodes.length])
    .range([width * 0.1, width * 0.9])

const yScale = d3
    .scaleLinear()
    .domain([0, data.nodes.length])
    .range([height * 0.1, height * 0.9])

data.nodes
    .map((n, i) => ({
        i,
        n,
    }))
    .sort((a, b) => a.n.votes - b.n.votes)
    .forEach(({ n }, i) => {
        n.x = xScale(i)
    })

data.nodes
    .map((n, i) => ({
        i,
        n,
    }))
    .sort((a, b) => a.n.avg_vote - b.n.avg_vote)
    .forEach(({ n }, i) => {
        n.y = yScale(i)
    })

const lines = svg
    .append("g")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("x1", (d) => id2node[d.source].x)
    .attr("y1", (d) => id2node[d.source].y)
    .attr("x2", (d) => id2node[d.target].x)
    .attr("y2", (d) => id2node[d.target].y)
    .attr("stroke", "#00000055")
    .attr("stroke-width", (d) => d["number_of_common_movies"] * 2)

let texts = svg
    .append("g")
    .selectAll("text")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
        return d.x + (d.size + d.name.length * 10) / 2
    })
    .attr("y", function (d, i) {
        return d.y - (d.size * 0.4) / 2
    })
    .text(function (d, i) {
        return d.name
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "hanging")
    .attr("fill", "#000000")

let nodes = svg
    .append("g")
    .selectAll("rect")
    .data(data.nodes)
    .enter()
    .append("rect")
    .attr("x", (d) => d.x - d.size / 2)
    .attr("y", (d) => d.y - (d.size * 0.4) / 2)
    .attr("height", (d) => d.size * 0.4)
    .attr("width", (d) => d.size)
    .attr("fill", "#ffffff")
    .attr("stroke", "#555555")
    .attr("stroke-width", "1")

const yearRange = [2016, 2020]
const numberOfMoviesByYearRange = [Infinity, -Infinity]
data.nodes.forEach((n) => {
    for (let year in n["number_of_movies_by_year"]) {
        const num = n["number_of_movies_by_year"][year]
        numberOfMoviesByYearRange[0] = Math.min(
            numberOfMoviesByYearRange[0],
            num
        )
        numberOfMoviesByYearRange[1] = Math.max(
            numberOfMoviesByYearRange[1],
            num
        )
    }
})

const lineXScale = d3
    .scaleLinear()
    .domain(yearRange)
    .range([-size * 0.3, size * 0.3])

const lineYScale = d3
    .scaleLinear()
    .domain(numberOfMoviesByYearRange)
    .range([-size * 0.1, size * 0.1])

const linecharts = svg
    .append("g")
    .selectAll("g")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
    // .append("polyline")
    // .attr("points", (d) => {
    //     const pos = Object.entries(
    //         d.number_of_movies_by_year
    //     ).map(([year, num]) => {
    //         return `${lineXScale(year)},${lineYScale(num)}`
    //     })
    //     return pos.join(" ")
    // })
    .selectAll("line")
    .data((d) => {
        const pos = Object.entries(d.number_of_movies_by_year).map(
            ([year, num]) => {
                return {
                    x: lineXScale(year),
                    y: lineYScale(num),
                }
            }
        )

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
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y)
    .attr("stroke", "red")
    .attr("fill", "transparent")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
return svg.node()
