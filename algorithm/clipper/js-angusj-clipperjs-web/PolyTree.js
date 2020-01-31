"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PolyNode_1 = require("./PolyNode");
/**
 * PolyTree is intended as a read-only data structure that should only be used to receive solutions from clipping and offsetting operations. It's an
 * alternative to the Paths data structure which also receives these solutions. PolyTree's two major advantages over the Paths structure are: it properly
 * represents the parent-child relationships of the returned polygons; it differentiates between open and closed paths. However, since PolyTree is a more
 * complex structure than the Paths structure, and since it's more computationally expensive to process (the Execute method being roughly 5-10% slower), it
 * should used only be when parent-child polygon relationships are needed, or when open paths are being 'clipped'.
 *
 * A PolyTree object is a container for any number of PolyNode children, with each contained PolyNode representing a single polygon contour (either an outer
 * or hole polygon). PolyTree itself is a specialized PolyNode whose immediate children represent the top-level outer polygons of the solution. (It's own
 * Contour property is always empty.) The contained top-level PolyNodes may contain their own PolyNode children representing hole polygons that may also
 * contain children representing nested outer polygons etc. Children of outers will always be holes, and children of holes will always be outers.
 *
 * PolyTrees can also contain open paths. Open paths will always be represented by top level PolyNodes. Two functions are provided to quickly separate out
 * open and closed paths from a polytree - openPathsFromPolyTree and closedPathsFromPolyTree.
 */
var PolyTree = /** @class */ (function (_super) {
    __extends(PolyTree, _super);
    function PolyTree() {
        var _this = _super.call(this) || this;
        _this._total = 0;
        return _this;
    }
    Object.defineProperty(PolyTree.prototype, "total", {
        /**
         * Returns the total number of PolyNodes (polygons) contained within the PolyTree. This value is not to be confused with childs.length which returns the
         * number of immediate children only (Childs) contained by PolyTree.
         */
        get: function () {
            return this._total;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method returns the first outer polygon contour if any, otherwise undefined.
     *
     * This function is equivalent to calling childs[0].
     */
    PolyTree.prototype.getFirst = function () {
        if (this.childs.length > 0) {
            return this.childs[0];
        }
        else {
            return undefined;
        }
    };
    /**
     * Internal use.
     * Constructs a PolyTree from a native PolyTree.
     */
    PolyTree.fromNativePolyTree = function (nativeLib, nativePolyTree, freeNativePolyTree) {
        var pt = new PolyTree();
        PolyNode_1.PolyNode.fillFromNativePolyNode(pt, nativeLib, nativePolyTree, undefined, 0, false); // do NOT free them, they are freed on destruction of the polytree
        pt._total = nativePolyTree.total();
        if (freeNativePolyTree) {
            nativePolyTree.delete(); // this deletes all inner paths, contours etc
        }
        return pt;
    };
    return PolyTree;
}(PolyNode_1.PolyNode));
exports.PolyTree = PolyTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seVRyZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUG9seVRyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsdUNBQXNDO0FBRXRDOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0g7SUFBOEIsNEJBQVE7SUF3QnBDO1FBQUEsWUFDRSxpQkFBTyxTQUNSO1FBekJTLFlBQU0sR0FBVyxDQUFDLENBQUM7O0lBeUI3QixDQUFDO0lBbkJELHNCQUFJLDJCQUFLO1FBSlQ7OztXQUdHO2FBQ0g7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFFRDs7OztPQUlHO0lBQ0ksMkJBQVEsR0FBZjtRQUNFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsT0FBTyxTQUFTLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBTUQ7OztPQUdHO0lBQ0ksMkJBQWtCLEdBQXpCLFVBQ0UsU0FBbUMsRUFDbkMsY0FBOEIsRUFDOUIsa0JBQTJCO1FBRTNCLElBQU0sRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDMUIsbUJBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsa0VBQWtFO1FBRXZKLEVBQUUsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRW5DLElBQUksa0JBQWtCLEVBQUU7WUFDdEIsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsNkNBQTZDO1NBQ3ZFO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFoREQsQ0FBOEIsbUJBQVEsR0FnRHJDO0FBaERZLDRCQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZVwiO1xyXG5pbXBvcnQgeyBOYXRpdmVQb2x5VHJlZSB9IGZyb20gXCIuL25hdGl2ZS9OYXRpdmVQb2x5VHJlZVwiO1xyXG5pbXBvcnQgeyBQb2x5Tm9kZSB9IGZyb20gXCIuL1BvbHlOb2RlXCI7XHJcblxyXG4vKipcclxuICogUG9seVRyZWUgaXMgaW50ZW5kZWQgYXMgYSByZWFkLW9ubHkgZGF0YSBzdHJ1Y3R1cmUgdGhhdCBzaG91bGQgb25seSBiZSB1c2VkIHRvIHJlY2VpdmUgc29sdXRpb25zIGZyb20gY2xpcHBpbmcgYW5kIG9mZnNldHRpbmcgb3BlcmF0aW9ucy4gSXQncyBhblxyXG4gKiBhbHRlcm5hdGl2ZSB0byB0aGUgUGF0aHMgZGF0YSBzdHJ1Y3R1cmUgd2hpY2ggYWxzbyByZWNlaXZlcyB0aGVzZSBzb2x1dGlvbnMuIFBvbHlUcmVlJ3MgdHdvIG1ham9yIGFkdmFudGFnZXMgb3ZlciB0aGUgUGF0aHMgc3RydWN0dXJlIGFyZTogaXQgcHJvcGVybHlcclxuICogcmVwcmVzZW50cyB0aGUgcGFyZW50LWNoaWxkIHJlbGF0aW9uc2hpcHMgb2YgdGhlIHJldHVybmVkIHBvbHlnb25zOyBpdCBkaWZmZXJlbnRpYXRlcyBiZXR3ZWVuIG9wZW4gYW5kIGNsb3NlZCBwYXRocy4gSG93ZXZlciwgc2luY2UgUG9seVRyZWUgaXMgYSBtb3JlXHJcbiAqIGNvbXBsZXggc3RydWN0dXJlIHRoYW4gdGhlIFBhdGhzIHN0cnVjdHVyZSwgYW5kIHNpbmNlIGl0J3MgbW9yZSBjb21wdXRhdGlvbmFsbHkgZXhwZW5zaXZlIHRvIHByb2Nlc3MgKHRoZSBFeGVjdXRlIG1ldGhvZCBiZWluZyByb3VnaGx5IDUtMTAlIHNsb3dlciksIGl0XHJcbiAqIHNob3VsZCB1c2VkIG9ubHkgYmUgd2hlbiBwYXJlbnQtY2hpbGQgcG9seWdvbiByZWxhdGlvbnNoaXBzIGFyZSBuZWVkZWQsIG9yIHdoZW4gb3BlbiBwYXRocyBhcmUgYmVpbmcgJ2NsaXBwZWQnLlxyXG4gKlxyXG4gKiBBIFBvbHlUcmVlIG9iamVjdCBpcyBhIGNvbnRhaW5lciBmb3IgYW55IG51bWJlciBvZiBQb2x5Tm9kZSBjaGlsZHJlbiwgd2l0aCBlYWNoIGNvbnRhaW5lZCBQb2x5Tm9kZSByZXByZXNlbnRpbmcgYSBzaW5nbGUgcG9seWdvbiBjb250b3VyIChlaXRoZXIgYW4gb3V0ZXJcclxuICogb3IgaG9sZSBwb2x5Z29uKS4gUG9seVRyZWUgaXRzZWxmIGlzIGEgc3BlY2lhbGl6ZWQgUG9seU5vZGUgd2hvc2UgaW1tZWRpYXRlIGNoaWxkcmVuIHJlcHJlc2VudCB0aGUgdG9wLWxldmVsIG91dGVyIHBvbHlnb25zIG9mIHRoZSBzb2x1dGlvbi4gKEl0J3Mgb3duXHJcbiAqIENvbnRvdXIgcHJvcGVydHkgaXMgYWx3YXlzIGVtcHR5LikgVGhlIGNvbnRhaW5lZCB0b3AtbGV2ZWwgUG9seU5vZGVzIG1heSBjb250YWluIHRoZWlyIG93biBQb2x5Tm9kZSBjaGlsZHJlbiByZXByZXNlbnRpbmcgaG9sZSBwb2x5Z29ucyB0aGF0IG1heSBhbHNvXHJcbiAqIGNvbnRhaW4gY2hpbGRyZW4gcmVwcmVzZW50aW5nIG5lc3RlZCBvdXRlciBwb2x5Z29ucyBldGMuIENoaWxkcmVuIG9mIG91dGVycyB3aWxsIGFsd2F5cyBiZSBob2xlcywgYW5kIGNoaWxkcmVuIG9mIGhvbGVzIHdpbGwgYWx3YXlzIGJlIG91dGVycy5cclxuICpcclxuICogUG9seVRyZWVzIGNhbiBhbHNvIGNvbnRhaW4gb3BlbiBwYXRocy4gT3BlbiBwYXRocyB3aWxsIGFsd2F5cyBiZSByZXByZXNlbnRlZCBieSB0b3AgbGV2ZWwgUG9seU5vZGVzLiBUd28gZnVuY3Rpb25zIGFyZSBwcm92aWRlZCB0byBxdWlja2x5IHNlcGFyYXRlIG91dFxyXG4gKiBvcGVuIGFuZCBjbG9zZWQgcGF0aHMgZnJvbSBhIHBvbHl0cmVlIC0gb3BlblBhdGhzRnJvbVBvbHlUcmVlIGFuZCBjbG9zZWRQYXRoc0Zyb21Qb2x5VHJlZS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBQb2x5VHJlZSBleHRlbmRzIFBvbHlOb2RlIHtcclxuICBwcm90ZWN0ZWQgX3RvdGFsOiBudW1iZXIgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSB0b3RhbCBudW1iZXIgb2YgUG9seU5vZGVzIChwb2x5Z29ucykgY29udGFpbmVkIHdpdGhpbiB0aGUgUG9seVRyZWUuIFRoaXMgdmFsdWUgaXMgbm90IHRvIGJlIGNvbmZ1c2VkIHdpdGggY2hpbGRzLmxlbmd0aCB3aGljaCByZXR1cm5zIHRoZVxyXG4gICAqIG51bWJlciBvZiBpbW1lZGlhdGUgY2hpbGRyZW4gb25seSAoQ2hpbGRzKSBjb250YWluZWQgYnkgUG9seVRyZWUuXHJcbiAgICovXHJcbiAgZ2V0IHRvdGFsKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fdG90YWw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBvdXRlciBwb2x5Z29uIGNvbnRvdXIgaWYgYW55LCBvdGhlcndpc2UgdW5kZWZpbmVkLlxyXG4gICAqXHJcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBlcXVpdmFsZW50IHRvIGNhbGxpbmcgY2hpbGRzWzBdLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRGaXJzdCgpOiBQb2x5Tm9kZSB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAodGhpcy5jaGlsZHMubGVuZ3RoID4gMCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5jaGlsZHNbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEludGVybmFsIHVzZS5cclxuICAgKiBDb25zdHJ1Y3RzIGEgUG9seVRyZWUgZnJvbSBhIG5hdGl2ZSBQb2x5VHJlZS5cclxuICAgKi9cclxuICBzdGF0aWMgZnJvbU5hdGl2ZVBvbHlUcmVlKFxyXG4gICAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXHJcbiAgICBuYXRpdmVQb2x5VHJlZTogTmF0aXZlUG9seVRyZWUsXHJcbiAgICBmcmVlTmF0aXZlUG9seVRyZWU6IGJvb2xlYW5cclxuICApOiBQb2x5VHJlZSB7XHJcbiAgICBjb25zdCBwdCA9IG5ldyBQb2x5VHJlZSgpO1xyXG4gICAgUG9seU5vZGUuZmlsbEZyb21OYXRpdmVQb2x5Tm9kZShwdCwgbmF0aXZlTGliLCBuYXRpdmVQb2x5VHJlZSwgdW5kZWZpbmVkLCAwLCBmYWxzZSk7IC8vIGRvIE5PVCBmcmVlIHRoZW0sIHRoZXkgYXJlIGZyZWVkIG9uIGRlc3RydWN0aW9uIG9mIHRoZSBwb2x5dHJlZVxyXG5cclxuICAgIHB0Ll90b3RhbCA9IG5hdGl2ZVBvbHlUcmVlLnRvdGFsKCk7XHJcblxyXG4gICAgaWYgKGZyZWVOYXRpdmVQb2x5VHJlZSkge1xyXG4gICAgICBuYXRpdmVQb2x5VHJlZS5kZWxldGUoKTsgLy8gdGhpcyBkZWxldGVzIGFsbCBpbm5lciBwYXRocywgY29udG91cnMgZXRjXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHB0O1xyXG4gIH1cclxufVxyXG4iXX0=