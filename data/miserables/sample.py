import json
import random

def sampleLink(data, cnt):
    data['links'] = random.sample(data['links'], cnt)
    nodeMap = { n['id'] : n for n in data['nodes'] }

    data['nodes'] = []
    remainNodes = {}

    for l in data['links']:
        if l['source'] not in remainNodes:
            remainNodes[l['source']] = nodeMap[l['source']]
        if l['target'] not in remainNodes:
            remainNodes[l['target']] = nodeMap[l['target']]

    data['nodes'] = list(remainNodes.values())

    return data

def sampleNodes(data, nodes):
    nodeMap = { n['id'] : n for n in data['nodes'] }
    data['nodes'] = [nodeMap[n] for n in nodes]
    data['links'] = [l for l in data['links'] if (l['source'] in nodes and l['target'] in nodes)]
    return data


with open('miserables.json') as f:
    data = json.load(f)

# data = sampleLink(data, 5)
data = sampleNodes(data, ["Myriel", "Valjean", "Fantine", "Marius", "Gavroche"])
    
with open('miserables_5.json', 'w') as f:
    json.dump(data, f)
