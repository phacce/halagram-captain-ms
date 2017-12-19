/*
    Used to safely handle or cast data between array and object data types
    array() tries to make the input an array or returns an empty array
    object() tries to make the input an object or returns an empty object
    toArray() embeds the input into an array if it cant be casted into an array,
    toObject() removes all entries whose values are undefined
*/

module.exports = obj =  {
    
    array(input, defaults =  [], embed = false) {
        if (Array.isArray(input)) {
            return input;
        } else if (input instanceof Set) {
            return Array.from(input);
        } else {
            try {
                let json = JSON.parse(input);
                return obj.array(json, embed);
            } catch(e) {
                if(embed && input) return [input];
                else return defaults;
            }
        }
    },

    object(input) {
        if (input instanceof Object) {
            return input;
        } else {
            try {
                let json = JSON.parse(input);
                return obj.object(json);
            } catch(e) {
                return {};
            }
        }
    },

    toArray(input){        
        return obj.array(input, [],true);
    },

    toObject(input){
        input = obj.object(input);
        let retObj = {};
        Object.keys(input).forEach(key =>{
            if(input[key] != undefined || input[key] != null){
                retObj[key] = input[key];
            }
        });
        return retObj;
    }
};