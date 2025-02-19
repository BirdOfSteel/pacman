import { mapArray } from "./map.js";
import { pacman } from "../classes/Pacman.js";

function convertMapToPathingGrid() {
    const wallComponents = ['┌','┐','└','┘','-','|'];
    let pathingGrid = [];
    
    for (let row = 0; row < mapArray.length; row++) {
      let newRow = []
      
      for (let col = 0; col < mapArray[0].length; col++) {
          const char = mapArray[row][col];

          if (wallComponents.includes(char)) {
              newRow.push(0);
          } else {
              newRow.push(1);
          }
      }

      pathingGrid.push(newRow);
    }

    return pathingGrid;
}

// A* pathfinder by https://github.com/bgrins/javascript-astar
export default function pathTo(node) {
    var curr = node;
    var path = [];
    while (curr.parent) {
      path.unshift(curr);
      curr = curr.parent;
    }

    return path;
}

  function getHeap() {
    return new BinaryHeap(function(node) {
      return node.f;
    });
  }

  var astar = {
    search: function(graph, start, end, options) {
      graph.cleanDirty();
      options = options || {};
      var heuristic = options.heuristic || astar.heuristics.manhattan;
      var closest = options.closest || false;

      var openHeap = getHeap();
      var closestNode = start;

      start.h = heuristic(start, end);
      graph.markDirty(start);
      openHeap.push(start);

      while (openHeap.size() > 0) {
        var currentNode = openHeap.pop();

        if (currentNode === end) {
          return pathTo(currentNode);
        }

        currentNode.closed = true;
        var neighbors = graph.neighbors(currentNode);

        for (var i = 0, il = neighbors.length; i < il; ++i) {
          var neighbor = neighbors[i];

          if (neighbor.closed || neighbor.isWall()) {
            continue;
          }

          var gScore = currentNode.g + neighbor.getCost(currentNode);
          var beenVisited = neighbor.visited;

          if (!beenVisited || gScore < neighbor.g) {
            neighbor.visited = true;
            neighbor.parent = currentNode;
            neighbor.h = neighbor.h || heuristic(neighbor, end);
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;
            graph.markDirty(neighbor);

            if (closest && (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g))) {
              closestNode = neighbor;
            }

            if (!beenVisited) {
              openHeap.push(neighbor);
            } else {
              openHeap.rescoreElement(neighbor);
            }
          }
        }
      }

      return closest ? pathTo(closestNode) : [];
    },

    heuristics: {
        manhattan: function(pos0, pos1) {
            return Math.abs(pos1.x - pos0.x) + Math.abs(pos1.y - pos0.y);
        }
    },

    cleanNode: function(node) {
      node.f = 0;
      node.g = 0;
      node.h = 0;
      node.visited = false;
      node.closed = false;
      node.parent = null;
      }
    };

    function Graph(gridIn, options) {
      options = options || {};
      this.nodes = [];
      this.grid = [];

      for (var x = 0; x < gridIn.length; x++) {
          this.grid[x] = [];
          for (var y = 0; y < gridIn[x].length; y++) {
              var node = new GridNode(x, y, gridIn[x][y]);
              this.grid[x][y] = node;
              this.nodes.push(node);
          }
      }

      this.init();
    }

  Graph.prototype.init = function() {
    this.dirtyNodes = [];
    for (var i = 0; i < this.nodes.length; i++) {
      astar.cleanNode(this.nodes[i]);
    }
  };

  Graph.prototype.cleanDirty = function() {
    for (var i = 0; i < this.dirtyNodes.length; i++) {
      astar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
  };

  Graph.prototype.markDirty = function(node) {
    this.dirtyNodes.push(node);
  };

  Graph.prototype.neighbors = function(node) {
    var ret = [];
    var x = node.x;
    var y = node.y;
    var grid = this.grid;

    if (grid[x - 1] && grid[x - 1][y]) ret.push(grid[x - 1][y]);
    if (grid[x + 1] && grid[x + 1][y]) ret.push(grid[x + 1][y]);
    if (grid[x] && grid[x][y - 1]) ret.push(grid[x][y - 1]);
    if (grid[x] && grid[x][y + 1]) ret.push(grid[x][y + 1]);

    return ret;
  };

  function GridNode(x, y, weight) {
    this.x = x;
    this.y = y;
    this.weight = weight;
  }

  GridNode.prototype.getCost = function(fromNeighbor) {
    return this.weight;
  };

  GridNode.prototype.isWall = function() {
    return this.weight === 0;
  };

  function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  BinaryHeap.prototype = {
    push: function(element) {
      this.content.push(element);
      this.sinkDown(this.content.length - 1);
    },
    pop: function() {
        var result = this.content[0];
        var end = this.content.pop();
        if (this.content.length > 0) {
          this.content[0] = end;
          this.bubbleUp(0);
        }
        return result;
    },
    size: function() {
      return this.content.length;
    },
    rescoreElement: function(node) {
      this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
      var element = this.content[n];
      while (n > 0) {
        var parentN = ((n + 1) >> 1) - 1;
        var parent = this.content[parentN];
        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
          this.content[parentN] = element;
          this.content[n] = parent;
          n = parentN;
        } else {
          break;
        }
      }
    },
    bubbleUp: function(n) {
      var length = this.content.length;
      var element = this.content[n];
      var elemScore = this.scoreFunction(element);

      while (true) {
        var child2N = (n + 1) << 1;
        var child1N = child2N - 1;
        var swap = null;
        var child1Score;

        if (child1N < length) {
          var child1 = this.content[child1N];
          child1Score = this.scoreFunction(child1);
          if (child1Score < elemScore) {
            swap = child1N;
          }
        }

        if (child2N < length) {
          var child2 = this.content[child2N];
          var child2Score = this.scoreFunction(child2);
          if (child2Score < (swap === null ? elemScore : child1Score)) {
            swap = child2N;
          }
        }

        if (swap !== null) {
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        } else {
          break;
        }   
      }
    }
};

const pathingGrid = convertMapToPathingGrid();
var graph = new Graph(pathingGrid);

export function generatePath(ghostX, ghostY) {
    const start = graph.grid[ghostY][ghostX];
    const end = graph.grid[pacman.posY][pacman.posX];

    const path = astar.search(graph, start, end); 
    return path;
}