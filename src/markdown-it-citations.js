/**
 * Adapted from https://github.com/markdown-it/markdown-it-footnote
 */
'use strict';

module.exports = function markdown_it_citations(markdown) {
  markdown.renderer.rules.citation = render_citation;
  markdown.renderer.rules.bibliography = render_bibliography;
  markdown.inline.ruler.after('image', 'citation', citation);
  markdown.core.ruler.after('inline', 'bibliography', bibliography);

  // Process citations ([^...])
  function citation(state, silent) {
    var label,
        pos,
        footnoteId,
        footnoteSubId,
        token,
        max = state.posMax,
        start = state.pos;

    // should be at least 4 chars - "[^x]"
    if (start + 3 > max) { return false; }

    if (!state.env.references) { return false; }
    if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
    if (state.src.charCodeAt(start + 1) !== 0x5E/* ^ */) { return false; }

    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 0x20) { return false; }
      if (state.src.charCodeAt(pos) === 0x0A) { return false; }
      if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
        break;
      }
    }

    if (pos === start + 2) { return false; } // no empty footnote labels
    if (pos >= max) { return false; }
    pos++;

    label = state.src.slice(start + 2, pos - 1);

    if (typeof state.env.references[label] === 'undefined') { return false; }

    if (!silent) {
      token      = state.push('citation', '', 0);
      token.meta = { label: label };
    }

    state.pos = pos;
    state.posMax = max;
    return true;
  }

  // Append bibliography to end of token stream
  function bibliography(state) {
    if (!state.env.references) { return; }

    let token = new state.Token('bibliography', '', 0);
    state.tokens.push(token);
  }

};

////////////////////////////////////////////////////////////////////////////////
// Renderer partials

function render_citation(tokens, idx, options, env, slf) {
  return env.bibliography.format('citation', {
    format: 'html',
    entry: tokens[idx].meta.label,
    template: env.citation_style || 'apa'
  });
}

function render_bibliography (tokens, idx, options, env) {
  return env.bibliography.format('bibliography', {
    format: 'html',
    template: env.citation_style || 'apa'
  });
}
