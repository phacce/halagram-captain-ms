module.exports = obj =  {
    array(input, embed = false){
        if(Array.isArray(input)){
            return input;
        }else if(input instanceof Set){
            return Array.from(input);
        }else{
            try{
                let json = JSON.parse(input)
                return obj.array(json,embed)
            }catch(e){
                if(embed && input){
                    return [input];
                }
                return [];
            }
        }
    },

    object(input){
         if(typeof input == 'object'){
            return input 
         }else{
             try{
                 let json = JSON.parse(input);
                 return obj.object(json);
             }catch(e){
                 return {};
             }
         }
    },
    toArray(input){        
        return obj.array(input,true);
    }
}