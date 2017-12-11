


module.exports = class baseSchemaClass{
    static get(filter){
        return this.find(this.ObjId({},filter));
    }
    
    static getOne(id, filter){   
        return this.findOne(this.ObjId(id))
    }


    static getOneOrMany(id, filter){
        return id? this.getOne(id, filter) : this.get(filter);
    }

    static ObjId(id,filter){
        if(id){
            id = (id instanceof Object) ? id : {_id : id};
        }else{
            id = {}
        }
        return filter? Object.assign(filter, id): id;    
    }    
}