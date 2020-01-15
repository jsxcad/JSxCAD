import { toTransformedGeometry, translate, measureBoundingBox } from './jsxcad-geometry-tagged.js';

var Rect = /** @class */ (function () {
    function Rect() {
        /**
         * 起点 x 坐标
         */
        this.x = 0;
        /**
         * 起点 y 坐标
         */
        this.y = 0;
        /**
         * 宽度
         */
        this.width = 0;
        /**
         * 高度
         */
        this.height = 0;
        /**
         * 当前是否被旋转了
         */
        this.isRotated = false;
    }
    /**
     * 克隆
     */
    Rect.prototype.clone = function () {
        var cloned = new Rect();
        cloned.x = this.x;
        cloned.y = this.y;
        cloned.height = this.height;
        cloned.width = this.width;
        cloned.info = this.info;
        return cloned;
    };
    /**
     * 矩形是否在另一个矩形内部
     * @param otherRect {Rect}
     */
    Rect.prototype.isIn = function (otherRect) {
        return (this.x >= otherRect.x &&
            this.y >= otherRect.y &&
            this.x + this.width <= otherRect.x + otherRect.width &&
            this.y + this.height <= otherRect.y + otherRect.height);
    };
    return Rect;
}());

var FindPosition;
(function (FindPosition) {
    FindPosition[FindPosition["ShortSideFit"] = 0] = "ShortSideFit";
    FindPosition[FindPosition["BottomLeft"] = 1] = "BottomLeft";
    FindPosition[FindPosition["ContactPoint"] = 2] = "ContactPoint";
    FindPosition[FindPosition["LongSideFit"] = 3] = "LongSideFit";
    FindPosition[FindPosition["AreaFit"] = 4] = "AreaFit";
})(FindPosition || (FindPosition = {}));
var MaxRectBinPack = /** @class */ (function () {
    /**
     * 构建方程
     * @param width {number} 画板宽度
     * @param height {number} 画板高度
     * @param allowRotate {boolean} 允许旋转
     */
    function MaxRectBinPack(width, height, allowRotate) {
        this.freeRects = [];
        this.usedRects = [];
        this.containerHeight = height;
        this.containerWidth = width;
        this.allowRotate = allowRotate === true;
        var rect = new Rect();
        rect.x = 0;
        rect.y = 0;
        rect.width = width;
        rect.height = height;
        this.freeRects.push(rect);
    }
    /**
     * 在线算法入口 插入矩形方法
     * @param width {number}
     * @param height {number}
     * @param method {FindPosition}
     */
    MaxRectBinPack.prototype.insert = function (width, height, method) {
        // width height 参数合法性检查
        if (width <= 0 || height <= 0) {
            throw new Error("width & height should greater than 0, but got width as " + width + ", height as " + height);
        }
        // method 合法性检查
        if (method <= FindPosition.ShortSideFit || method >= FindPosition.AreaFit) {
            method = FindPosition.ShortSideFit;
        }
        var newRect = new Rect();
        var score1 = {
            value: 0,
        };
        var score2 = {
            value: 0,
        };
        switch (method) {
            case FindPosition.ShortSideFit:
                newRect = this.findPositionForNewNodeBestShortSideFit(width, height, score1, score2);
                break;
            case FindPosition.BottomLeft:
                newRect = this.findPositionForNewNodeBottomLeft(width, height, score1, score2);
                break;
            case FindPosition.ContactPoint:
                newRect = this.findPositionForNewNodeContactPoint(width, height, score1);
                break;
            case FindPosition.LongSideFit:
                newRect = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                break;
            case FindPosition.AreaFit:
                newRect = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                break;
        }
        if (newRect.height === 0) {
            return newRect;
        }
        if (this.allowRotate) { // 更新旋转属性
            if (newRect.height === height && newRect.width === width) {
                newRect.isRotated = false;
            }
            else {
                // TODO: check is really rotated
                newRect.isRotated = true;
            }
        }
        this.placeRectangle(newRect);
        return newRect;
    };
    /**
     * 算法离线入口 插入一组举行
     * @param rects {Rect[]} 矩形数组
     * @param method {FindPosition} 查找位置的方法
     */
    MaxRectBinPack.prototype.insertRects = function (rects, method) {
        // rects 参数合法性检查
        if (rects && rects.length === 0) {
            throw new Error('rects should be array with length greater than zero');
        }
        // method 合法性检查
        if (method <= FindPosition.ShortSideFit || method >= FindPosition.AreaFit) {
            method = FindPosition.ShortSideFit;
        }
        var result = [];
        while (rects.length > 0) {
            var bestScore1 = {
                value: Infinity,
            };
            var bestScore2 = {
                value: Infinity,
            };
            var bestRectIndex = -1;
            var bestNode = void 0;
            for (var i = 0; i < rects.length; ++i) {
                var score1 = {
                    value: 0,
                };
                var score2 = {
                    value: 0,
                };
                var newNode = this.scoreRectangle(rects[i].width, rects[i].height, method, score1, score2);
                if (score1.value < bestScore1.value ||
                    (score1.value === bestScore1.value && score2.value < bestScore2.value)) {
                    bestScore1.value = score1.value;
                    bestScore2.value = score2.value;
                    bestNode = newNode;
                    bestRectIndex = i;
                }
            }
            if (bestRectIndex === -1) {
                return result;
            }
            this.placeRectangle(bestNode);
            bestNode.info = rects[bestRectIndex].info;
            if (this.allowRotate) {
                if (bestNode.height === rects[bestRectIndex].height &&
                    bestNode.width === rects[bestRectIndex].width) {
                    bestNode.isRotated = false;
                }
                else {
                    bestNode.isRotated = true;
                }
            }
            rects.splice(bestRectIndex, 1);
            result.push(bestNode);
        }
        return result;
    };
    MaxRectBinPack.prototype.occupancy = function () {
        var usedSurfaceArea = 0;
        for (var _i = 0, _a = this.usedRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            usedSurfaceArea += rect.width * rect.height;
        }
        return usedSurfaceArea / (this.containerWidth * this.containerHeight);
    };
    /**
     *
     * @param node
     */
    MaxRectBinPack.prototype.placeRectangle = function (node) {
        var numRectanglesToProcess = this.freeRects.length;
        for (var i = 0; i < numRectanglesToProcess; i++) {
            if (this.splitFreeNode(this.freeRects[i], node)) {
                this.freeRects.splice(i, 1);
                i--;
                numRectanglesToProcess--;
            }
        }
        this.pruneFreeList();
        this.usedRects.push(node);
    };
    MaxRectBinPack.prototype.scoreRectangle = function (width, height, method, score1, score2) {
        var newNode = new Rect();
        score1.value = Infinity;
        score2.value = Infinity;
        switch (method) {
            case FindPosition.ShortSideFit:
                newNode = this.findPositionForNewNodeBestShortSideFit(width, height, score1, score2);
                break;
            case FindPosition.BottomLeft:
                newNode = this.findPositionForNewNodeBottomLeft(width, height, score1, score2);
                break;
            case FindPosition.ContactPoint:
                newNode = this.findPositionForNewNodeContactPoint(width, height, score1);
                // todo: reverse
                score1.value = -score1.value; // Reverse since we are minimizing, but for contact point score bigger is better.
                break;
            case FindPosition.LongSideFit:
                newNode = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                break;
            case FindPosition.AreaFit:
                newNode = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                break;
        }
        // Cannot fit the current Rectangle.
        if (newNode.height === 0) {
            score1.value = Infinity;
            score2.value = Infinity;
        }
        return newNode;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeBottomLeft = function (width, height, bestY, bestX) {
        var freeRects = this.freeRects;
        var bestNode = new Rect();
        bestY.value = Infinity;
        var topSideY;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                topSideY = rect.y + height;
                if (topSideY < bestY.value ||
                    (topSideY === bestY.value && rect.x < bestX.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestY.value = topSideY;
                    bestX.value = rect.x;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                topSideY = rect.y + width;
                if (topSideY < bestY.value ||
                    (topSideY === bestY.value && rect.x < bestX.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestY.value = topSideY;
                    bestX.value = rect.x;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeBestShortSideFit = function (width, height, bestShortSideFit, bestLongSideFit) {
        var bestNode = new Rect();
        bestShortSideFit.value = Infinity;
        var leftoverHoriz;
        var leftoverVert;
        var shortSideFit;
        var longSideFit;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);
                if (shortSideFit < bestShortSideFit.value ||
                    (shortSideFit === bestShortSideFit.value &&
                        longSideFit < bestLongSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
            var flippedLeftoverHoriz = void 0;
            var flippedLeftoverVert = void 0;
            var flippedShortSideFit = void 0;
            var flippedLongSideFit = void 0;
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                flippedLeftoverHoriz = Math.abs(rect.width - height);
                flippedLeftoverVert = Math.abs(rect.height - width);
                flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);
                if (flippedShortSideFit < bestShortSideFit.value ||
                    (flippedShortSideFit === bestShortSideFit.value &&
                        flippedLongSideFit < bestLongSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = flippedShortSideFit;
                    bestLongSideFit.value = flippedLongSideFit;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeBestLongSideFit = function (width, height, bestShortSideFit, bestLongSideFit) {
        var bestNode = new Rect();
        bestLongSideFit.value = Infinity;
        var leftoverHoriz;
        var leftoverVert;
        var shortSideFit;
        var longSideFit;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);
                if (longSideFit < bestLongSideFit.value ||
                    (longSideFit === bestLongSideFit.value &&
                        shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                leftoverHoriz = Math.abs(rect.width - height);
                leftoverVert = Math.abs(rect.height - width);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);
                if (longSideFit < bestLongSideFit.value ||
                    (longSideFit === bestLongSideFit.value &&
                        shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeBestAreaFit = function (width, height, bestAreaFit, bestShortSideFit) {
        var bestNode = new Rect();
        bestAreaFit.value = Infinity;
        var leftoverHoriz;
        var leftoverVert;
        var shortSideFit;
        var areaFit;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            areaFit = rect.width * rect.height - width * height;
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                if (areaFit < bestAreaFit.value ||
                    (areaFit === bestAreaFit.value &&
                        shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestAreaFit.value = areaFit;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                leftoverHoriz = Math.abs(rect.width - height);
                leftoverVert = Math.abs(rect.height - width);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                if (areaFit < bestAreaFit.value ||
                    (areaFit === bestAreaFit.value &&
                        shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = shortSideFit;
                    bestAreaFit.value = areaFit;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.commonIntervalLength = function (i1start, i1end, i2start, i2end) {
        if (i1end < i2start || i2end < i1start) {
            return 0;
        }
        return Math.min(i1end, i2end) - Math.max(i1start, i2start);
    };
    MaxRectBinPack.prototype.contactPointScoreNode = function (x, y, width, height) {
        var score = 0;
        if (x === 0 || x + width === this.containerWidth) {
            score += height;
        }
        if (y === 0 || y + height === this.containerHeight) {
            score += width;
        }
        for (var _i = 0, _a = this.usedRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            if (rect.x === x + width || rect.x + rect.width === x) {
                score += this.commonIntervalLength(rect.y, rect.y + rect.height, y, y + height);
            }
            if (rect.y === y + height || rect.y + rect.height === y) {
                score += this.commonIntervalLength(rect.x, rect.x + rect.width, x, x + width);
            }
        }
        return score;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeContactPoint = function (width, height, bestContactScore) {
        var bestNode = new Rect();
        bestContactScore.value = -1;
        var score;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                score = this.contactPointScoreNode(rect.x, rect.y, width, height);
                if (score > bestContactScore.value) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestContactScore.value = score;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                score = this.contactPointScoreNode(rect.x, rect.y, height, width);
                if (score > bestContactScore.value) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestContactScore.value = score;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.splitFreeNode = function (freeNode, usedNode) {
        var freeRectangles = this.freeRects;
        // Test with SAT if the Rectangles even intersect.
        if (usedNode.x >= freeNode.x + freeNode.width ||
            usedNode.x + usedNode.width <= freeNode.x ||
            usedNode.y >= freeNode.y + freeNode.height ||
            usedNode.y + usedNode.height <= freeNode.y) {
            return false;
        }
        var newNode;
        if (usedNode.x < freeNode.x + freeNode.width &&
            usedNode.x + usedNode.width > freeNode.x) {
            // New node at the top side of the used node.
            if (usedNode.y > freeNode.y &&
                usedNode.y < freeNode.y + freeNode.height) {
                newNode = freeNode.clone();
                newNode.height = usedNode.y - newNode.y;
                freeRectangles.push(newNode);
            }
            // New node at the bottom side of the used node.
            if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
                newNode = freeNode.clone();
                newNode.y = usedNode.y + usedNode.height;
                newNode.height =
                    freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
                freeRectangles.push(newNode);
            }
        }
        if (usedNode.y < freeNode.y + freeNode.height &&
            usedNode.y + usedNode.height > freeNode.y) {
            // New node at the left side of the used node.
            if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
                newNode = freeNode.clone();
                newNode.width = usedNode.x - newNode.x;
                freeRectangles.push(newNode);
            }
            // New node at the right side of the used node.
            if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
                newNode = freeNode.clone();
                newNode.x = usedNode.x + usedNode.width;
                newNode.width =
                    freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
                freeRectangles.push(newNode);
            }
        }
        return true;
    };
    MaxRectBinPack.prototype.pruneFreeList = function () {
        var freeRectangles = this.freeRects;
        for (var i = 0; i < freeRectangles.length; i++) {
            for (var j = i + 1; j < freeRectangles.length; j++) {
                if (freeRectangles[i].isIn(freeRectangles[j])) {
                    freeRectangles.splice(i, 1);
                    break;
                }
                if (freeRectangles[j].isIn(freeRectangles[i])) {
                    freeRectangles.splice(j, 1);
                }
            }
        }
    };
    return MaxRectBinPack;
}());

var Genetic = /** @class */ (function () {
    function Genetic(rects, options) {
        this.rects = [];
        this.totalSquares = 0;
        this.maxHeight = -1;
        this.maxWidth = -1;
        this.randomDots = [];
        if (!options) {
            options = {};
        }
        this.rects = rects;
        this.size = options.size < 20 ? 20 : options.size;
        this.lifeTimes = options.lifeTimes || 8;
        this.liveRate = options.liveRate || 0.5;
        if (this.liveRate < 0 || this.liveRate > 1) {
            this.liveRate = 0.5;
        }
        this.findPosition = options.findPosition;
        this.allowRotate = options.allowRotate === true ? true : false;
    }
    Object.defineProperty(Genetic.prototype, "minHeight", {
        get: function () {
            return this.totalSquares / this.maxWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Genetic.prototype, "minWidth", {
        get: function () {
            return this.totalSquares / this.maxHeight;
        },
        enumerable: true,
        configurable: true
    });
    Genetic.prototype.calc = function () {
        this.open();
        this.work();
        return this.close();
    };
    Genetic.prototype.open = function () {
        // 二维空间内寻找边界
        for (var _i = 0, _a = this.rects; _i < _a.length; _i++) {
            var rect = _a[_i];
            this.totalSquares = rect.height * rect.width + this.totalSquares;
            this.maxHeight = rect.height + this.maxHeight;
            this.maxWidth = rect.width + this.maxWidth;
        }
        // 二维空间内生成随机点 虽然无法保证分布是随机分布，但是对遗传算法来说无所谓了。
        for (var i = 0; i < this.size; i++) {
            var randomHeight = this.maxHeight * Math.random() + this.minHeight;
            var randomWidth = this.maxWidth * Math.random() + this.minWidth;
            this.randomDots.push({
                x: randomWidth,
                y: randomHeight,
            });
        }
    };
    Genetic.prototype.work = function () {
        while (this.lifeTimes--) {
            var generation = [];
            for (var _i = 0, _a = this.randomDots; _i < _a.length; _i++) {
                var dot = _a[_i];
                // 生活
                var binPack = new MaxRectBinPack(dot.x, dot.y, this.allowRotate);
                var clonedRects = this.getRects();
                var result = binPack.insertRects(clonedRects, this.findPosition);
                generation.push({
                    dot: dot,
                    fitAll: result.length === this.rects.length,
                    occupancy: binPack.occupancy(),
                });
            }
            // 淘汰
            generation.sort(function (geneticA, geneticB) {
                if (geneticB.fitAll && geneticA.fitAll) {
                    return geneticB.occupancy - geneticA.occupancy;
                }
                else if (geneticB.fitAll) {
                    return 1;
                }
                else if (geneticA.fitAll) {
                    return -1;
                }
                else {
                    return geneticB.occupancy - geneticA.occupancy;
                }
            });
            this.bestDot = generation[0].dot;
            // 后置位淘汰有利于数据优化
            if (generation.length > this.size) {
                generation.splice(this.size, generation.length - this.size);
            }
            var killerStart = Math.ceil(this.liveRate * generation.length);
            generation.splice(killerStart, generation.length - killerStart);
            for (var i = generation.length - 1; i > 0; i--) {
                if (!generation[i].fitAll) {
                    generation.splice(i, 1);
                }
            }
            this.randomDots = [];
            // 新生
            if (generation.length === 0 || generation.length === 1) {
                // 如果团灭了 或者 无法继续交配
                for (var i = 0; i < this.size; i++) {
                    var randomHeight = this.maxHeight * Math.random() + this.minHeight;
                    var randomWidth = this.maxWidth * Math.random() + this.minWidth;
                    this.randomDots.push({
                        x: randomWidth,
                        y: randomHeight,
                    });
                }
            }
            else {
                // 非随机交配
                for (var i = 0; i < generation.length; i++) {
                    this.randomDots.push(generation[i].dot);
                    for (var j = i + 1; j < generation.length; j++) {
                        var startPoint = generation[i].dot;
                        var endPoint = generation[j].dot;
                        var _b = this.cross(startPoint.x, endPoint.x), sonX = _b[0], daughterX = _b[1];
                        var _c = this.cross(startPoint.y, endPoint.y), sonY = _c[0], daughterY = _c[1];
                        this.randomDots.push({
                            x: sonX,
                            y: sonY,
                        });
                        this.randomDots.push({
                            x: daughterX,
                            y: daughterY,
                        });
                    }
                }
                // 基因突变
                for (var i = 0; i < 20; i++) {
                    var randomHeight = this.maxHeight * Math.random() + this.minHeight;
                    var randomWidth = this.maxWidth * Math.random() + this.minWidth;
                    this.randomDots.push({
                        x: randomWidth,
                        y: randomHeight,
                    });
                }
            }
        }
    };
    Genetic.prototype.close = function () {
        return this.bestDot;
    };
    Genetic.prototype.getRects = function () {
        return this.rects.map(function (i) { return i.clone(); }); // tslint:disable-line arrow-parens
    };
    Genetic.prototype.cross = function (x, y) {
        var lerp = function (a, b) {
            return a + (b - a);
        };
        var formX = parseInt(x * 100 + '', 10);
        var formY = parseInt(y * 100 + '', 10);
        var binX = formX
            .toString(2)
            .split('')
            .map(function ($) { return parseInt($, 10); }); // tslint:disable-line
        var binY = formY
            .toString(2)
            .split('')
            .map(function ($) { return parseInt($, 10); }); // tslint:disable-line
        var son = [].concat(binX);
        var daughter = [].concat(binY);
        var i = Math.floor(Math.random() * binY.length);
        son[i] = lerp(binX[i], binY[i]);
        daughter[i] = lerp(binY[i], binX[i]);
        var sonvalue = parseInt(son.join(''), 2) / 100;
        var daughtervalue = parseInt(daughter.join(''), 2) / 100;
        return [sonvalue, daughtervalue];
    };
    return Genetic;
}());

var Search = /** @class */ (function () {
    /**
     * 初始化
     * @param rects 要插入的矩形数组
     * @param allowRotate 是否旋转
     * @param step 搜索步长 建议10
     * @param findPosition FindPostion 策略
     * @param rate 大于一的比率 等于1不可以的
     */
    function Search(rects, allowRotate, step, findPosition, rate) {
        this.rects = [];
        this.totalSquares = 0;
        this.maxHeight = -1;
        this.maxWidth = -1;
        this.rects = rects;
        this.allowRotate = allowRotate === true;
        this.step = step ? step : 1;
        this.findPosition = findPosition;
        if (rate <= 1) {
            throw new Error('rate should be grater than 1, but get ' + rate);
        }
        this.rate = rate;
        this.totalSquares = this.rects.reduce(function (i, v) {
            return i + v.height * v.width;
        }, 0);
        this.maxWidth = this.rects.reduce(function (i, v) {
            return i + v.width;
        }, this.step + 1); // 防止刚好踩到临界点情况
        this.maxHeight = this.rects.reduce(function (i, v) {
            return i + v.height;
        }, this.step + 1); // 防止刚好踩到临界点情况
    }
    Object.defineProperty(Search.prototype, "minHeight", {
        get: function () {
            return this.totalSquares / this.maxWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Search.prototype, "minWidth", {
        get: function () {
            return this.totalSquares / this.maxHeight;
        },
        enumerable: true,
        configurable: true
    });
    Search.prototype.search = function () {
        var bestResult = {
            height: 0,
            op: 0,
            width: 0,
        };
        for (var searchWidth = this.minWidth; searchWidth <= this.maxWidth; searchWidth += this.step) {
            var _a = this.bestHeight(searchWidth), height = _a[0], op = _a[1];
            if (op > bestResult.op) {
                bestResult.width = searchWidth;
                bestResult.height = height;
                bestResult.op = op;
            }
        }
        return { x: bestResult.width, y: bestResult.height };
    };
    Search.prototype.bestHeight = function (width) {
        var left = Math.max(this.minHeight, width / this.rate);
        var right = Math.min(this.maxHeight, width * this.rate);
        var bestResult = 0;
        var mid = 0;
        var bestHeight = 0;
        while (right - left >= this.step) {
            mid = Math.ceil((right + left) / 2);
            var _a = this.getInsertResult(width, mid), result = _a[0], op = _a[1];
            var isSuccess = result.length === this.rects.length;
            if (isSuccess) {
                if (op > bestResult) {
                    bestResult = op;
                    bestHeight = mid;
                }
                right = mid;
            }
            else {
                left = mid;
            }
        }
        return [bestHeight, bestResult];
    };
    Search.prototype.getInsertResult = function (width, height) {
        var binpacker = new MaxRectBinPack(width, height, this.allowRotate);
        var result = binpacker.insertRects(this.getRects(), this.findPosition);
        return [result, binpacker.occupancy()];
    };
    Search.prototype.getRects = function () {
        return this.rects.map(function ($) {
            return $.clone();
        });
    };
    return Search;
}());

const DO_NOT_ALLOW_ROTATE = false;
const SHORT_SIDE_FIT = 0;

const X = 0;
const Y = 1;

const measureSize = (geometry) => {
  const [min, max] = measureBoundingBox(geometry);
  const width = max[X] - min[X];
  const height = max[Y] - min[Y];
  return [width, height];
};

const measureOrigin = (geometry) => {
  const [min] = measureBoundingBox(geometry);
  const [x, y] = min;
  return [x, y];
};

const pack = ({ size = [210, 297], margin = 1 }, ...geometries) => {
  // Center the output to match pages.
  const xOffset = size[X] / -2;
  const yOffset = size[Y] / -2;

  const packedGeometries = [];
  const unpackedGeometries = [];

  const packer = new MaxRectBinPack(size[0], size[1], DO_NOT_ALLOW_ROTATE);

  for (const geometry of geometries) {
    const [width, height] = measureSize(geometry);
    const [boxWidth, boxHeight] = [width + margin * 2, height + margin * 2];
    const result = packer.insert(boxWidth, boxHeight, SHORT_SIDE_FIT);
    if (result.width === 0 && result.height === 0) {
      unpackedGeometries.push(geometry);
    } else {
      const [x, y] = measureOrigin(geometry);
      const transformed = toTransformedGeometry(translate([result.x - x + margin + xOffset, 0 - yOffset - ((result.y - y) + margin), 0], geometry));
      packedGeometries.push(transformed);
    }
  }

  return [packedGeometries, unpackedGeometries];
};

export { pack };
