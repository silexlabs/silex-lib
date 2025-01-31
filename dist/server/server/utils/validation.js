"use strict";
/*
 * Silex website builder, free/libre no-code tool for makers.
 * Copyright (c) 2023 lexoyo and Silex Labs foundation
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredParam = requiredParam;
/**
 * Throw an error if a parameter is missing
 * @param value the value to check
 * @param name the name of the parameter
 * @throws Error if the parameter is missing
 */
function requiredParam(value, name, defaultValue) {
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        const error = new Error(`Missing required parameter ${name}`);
        console.error(`Missing required parameter ${name}`, error);
        throw error;
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90cy9zZXJ2ZXIvdXRpbHMvdmFsaWRhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHOztBQVFILHNDQVVDO0FBaEJEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsYUFBYSxDQUFJLEtBQW9CLEVBQUUsSUFBWSxFQUFFLFlBQWdCO0lBQ25GLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQy9CLE9BQU8sWUFBOEIsQ0FBQTtRQUN2QyxDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsOEJBQThCLElBQUksRUFBRSxDQUFDLENBQUE7UUFDN0QsT0FBTyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDMUQsTUFBTSxLQUFLLENBQUE7SUFDYixDQUFDO0lBQ0QsT0FBTyxLQUF1QixDQUFBO0FBQ2hDLENBQUMifQ==