"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
function getAccessibilityTree(page) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield page.accessibility.snapshot());
    });
}
function traverse(node) {
    const attrs = node.attributes || {};
    const jsonNode = {
        Name: node.name,
        Role: node.role,
        'aria-label': attrs['aria-label'] || 'Not specified',
        'aria-labelledby': attrs['aria-labelledby'] || 'Not specified',
        title: attrs['title'] || 'Not specified',
        Children: []
    };
    // Recursive call for all children
    if (node.children) {
        jsonNode.Children = node.children.map(traverse);
    }
    return jsonNode;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield (0, puppeteer_1.launch)({ headless: "new" });
        const page = yield browser.newPage();
        try {
            const url = 'https://www.nrk.no/';
            yield page.goto(url);
            const accessibilityTree = yield getAccessibilityTree(page);
            if (accessibilityTree) {
                const jsonTree = traverse(accessibilityTree);
                console.log(JSON.stringify(jsonTree, null, 2));
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            yield browser.close();
        }
    });
}
run();
