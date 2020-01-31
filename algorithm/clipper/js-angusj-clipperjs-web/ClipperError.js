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
var ClipperError = /** @class */ (function (_super) {
    __extends(ClipperError, _super);
    function ClipperError(message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        Object.setPrototypeOf(_this, ClipperError.prototype);
        _this.name = _this.constructor.name;
        _this.stack = new Error().stack;
        return _this;
    }
    return ClipperError;
}(Error));
exports.ClipperError = ClipperError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpcHBlckVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NsaXBwZXJFcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtJQUFrQyxnQ0FBSztJQUNyQyxzQkFBbUIsT0FBZTtRQUFsQyxZQUNFLGtCQUFNLE9BQU8sQ0FBQyxTQUlmO1FBTGtCLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFFaEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFJLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELEtBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDbEMsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQzs7SUFDakMsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVBELENBQWtDLEtBQUssR0FPdEM7QUFQWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDbGlwcGVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgQ2xpcHBlckVycm9yLnByb3RvdHlwZSk7XHJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICB0aGlzLnN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XHJcbiAgfVxyXG59XHJcbiJdfQ==