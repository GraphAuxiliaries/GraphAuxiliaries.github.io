const fs = require('fs')

const nodeCnt = 13

const positionX = [200, 300, 100, 400, 100, 400, 200, 300, 400, 100, 200, 300, 400];//节点横坐标
const positionY = [100, 100, 200, 200, 300, 300, 400, 400, 400, 500, 500, 500, 500];//节点纵坐标
const nodeType = ['A', 'B', 'C', 'B', 'A', 'A', 'C', 'A', 'B', 'D', 'D', 'B', 'B'];//节点纵坐标
const width = 70
const height = 70

const links = [
    {
        source: 0,
        target: 1,
        direct: true,
    },
    {
        source: 0,
        target: 2,
        direct: true,
    },
    {
        source: 2,
        target: 4,
        direct: true,
    },
    {
        source: 4,
        target: 6,
        direct: true,
    },
    {
        source: 6,
        target: 7,
        direct: true,
    },
    {
        source: 5,
        target: 7,
        direct: true,
    },
    {
        source: 3,
        target: 5,
        direct: true,
    },
    {
        source: 1,
        target: 3,
        direct: true,
    },
    {
        source: 5,
        target: 8,
        direct: true,
    },
    {
        source: 8,
        target: 9,
        direct: false,
    },
    {
        source: 8,
        target: 10,
        direct: false,
    },
    {
        source: 8,
        target: 11,
        direct: false,
    },
    {
        source: 8,
        target: 12,
        direct: false,
    },
]

const nodes = Array(nodeCnt).fill().map((_, i) => {
    return {
        id: i,
        name: `test${i}`,
        x: positionX[i],
        y: positionY[i],
        width: width,
        height: height,
        type: nodeType[i],
        trends: Array(7).fill().map(() => Math.random())
    }
})

const res = {
    nodes,
    links
}

fs.writeFileSync('./data.json', JSON.stringify(res))