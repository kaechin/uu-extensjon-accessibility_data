import { Page, Browser, launch } from 'puppeteer';

interface NodeAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'title'?: string;
}

interface AccessibilityNode {
  name: string;
  role: string;
  attributes: NodeAttributes;
  children: AccessibilityNode[];
}

// Define the new interface for JsonNode
interface JsonNode {
  Name: string;
  Role: string;
  'aria-label': string;
  'aria-labelledby': string;
  title: string;
  Children: JsonNode[];
}

async function getAccessibilityTree(page: Page): Promise<AccessibilityNode> {
  return (await page.accessibility.snapshot()) as unknown as AccessibilityNode;
}

function traverse(node: AccessibilityNode): JsonNode {
  const attrs: NodeAttributes = node.attributes || {};
  
  const jsonNode: JsonNode = {
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

async function run() {
  const browser: Browser = await launch({ headless: "new" });
  const page: Page = await browser.newPage();

  try {
    const url = 'https://www.nrk.no/';
    await page.goto(url);

    const accessibilityTree = await getAccessibilityTree(page);

    if (accessibilityTree) {
      const jsonTree = traverse(accessibilityTree);
      console.log(JSON.stringify(jsonTree, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

run();

