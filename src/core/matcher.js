var reExpr = /([\w\.]+)\s*([\>\<\!\=]\=?)\s*([\w\.]+)/,
    reBool = /^(true|false)$/i,
    exprLookups = {
        '==': ['equals'],
        '>':  ['gt'],
        '>=': ['gte'],
        '<':  ['lt'],
        '<=': ['lte'],
        '!=': ['equals', 'not']
    };

function Matcher(target, opts) {
    // initialise options
    this.opts = opts || {};

    // initialise members
    this.target = target;
    this.passes = true;
}

Matcher.prototype = {
    gt: function(prop, value, result) {
        result = result || this;
        result.passes = result.passes && this.target && this.target[prop] > value;
        
        return this;
    },
    
    gte: function(prop, value, result) {
        result = result || this;
        result.passes = result.passes && this.target && this.target[prop] >= value;
        
        return this;
    },
    
    lt: function(prop, value, result) {
        result = result || this;
        result.passes = result.passes && this.target && this.target[prop] < value;
        
        return this;
    },
    
    lte: function(prop, value, result) {
        result = result || this;
        result.passes = result.passes && this.target && this.target[prop] <= value;
        
        return this;
    },
    
    equals: function(prop, value, result) {
        result = result || this;
        
        if (result.passes && this.target) {
            var testVal = this.target[prop],
                strings = (typeof testVal == 'string' || testVal instanceof String) &&
                    (typeof value == 'string' || value instanceof String);

            // if the test value is a string and the value is a string
            if (strings && (! this.opts.caseSensitive)) {
                result.passes = testVal.toLowerCase() === value.toLowerCase();
            }
            else {
                result.passes = testVal === value;
            }
        }
        
        return this;
    },
    
    not: function(prop, value, result) {
        // invert the passes state
        result = result || this;
        result.passes = !result.passes;
        
        return this;
    },
    
    query: function(text) {
        var match = reExpr.exec(text);
            
        while (match) {
            var fns = exprLookups[match[2]] || [],
                result = {
                    passes: fns.length > 0
                },
                val1 = parseFloat(match[1]) || match[1],
                val2 = parseFloat(match[3]) || match[3];
                
            // if value 2 is a boolean, then parse it
            if (reBool.test(val2)) {
                val2 = val2 == 'true';
            }
            
            // iterate through the required functions in order and evaluate the result
            for (var ii = 0, count = fns.length; ii < count; ii++) {
                var evaluator = this[fns[ii]];
                
                // if we have the evaluator, then run it
                if (evaluator) {
                    evaluator.call(this, val1, val2, result);
                }
            }
            
            text = text.slice(0, match.index) + result.passes + text.slice(match.index + match[0].length);
            match = reExpr.exec(text);
        }
        
        // split the text on
        this.passes = eval(text);
        
        return this;
    }
};