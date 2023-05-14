function extractParentSuggestions(suggestionsArray) {
    const fatherSuggestions = [];
    const motherSuggestions = [];

    suggestionsArray.forEach((suggestion) => {
        if (suggestion.gender === 1) {
            fatherSuggestions.push(suggestion);
        }
        else {
            motherSuggestions.push(suggestion);
        }
    });

    return {fatherSuggestions, motherSuggestions};
}

module.exports = extractParentSuggestions;