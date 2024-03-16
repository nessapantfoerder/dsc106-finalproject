import katex from "katex";

export default function katexify(latexExpression, displayMode) {
  // Ensure that KaTeX is loaded (you might already have this in your setup)
  if (typeof katex !== 'undefined') {
      return katex.renderToString(latexExpression, { displayMode: displayMode });
  } else {
      console.error("KaTeX is not loaded.");
      return latexExpression; // Fallback to display the LaTeX expression as plain text
  }
}
