/**
 * This class contains the base class to be loaded into mongoose schemas
 */

module.exports = class BaseSchemaClass {

    static add(objs) {
        return this.create(objs);
    }

    static get(filter){
        return this.find(this.ObjId({}, filter));
    }
    
    static getOne(id, filter){   
        return this.findOne(this.ObjId(id));
    }

    static getOneOrMany(id, filter){
        return id? this.getOne(id, filter) : this.get(filter);
    }

	static edit(params, newObj, multiple = false) {
        if (multiple) return this.editMultiple(params, newObj);
        else return this.editOne(params, newObj);
    }

    static editMultiple(params, newObj) {
        return new Promise((resolve, reject) => {
            this.update(params, newObj, { multi: true }, (err, oldObj) => {
                if (err) reject(err);
                this.get(params) /* get the updated documents */
                .then((result) => {
                    resolve(result);
                }, err => reject(err))
                .catch(err => reject(err));
            });
        });
    }

    static editOne(params, newObj) {
        return this.findOneAndUpdate(params, newObj, {new: true});
    }

    static delete(params, multiple = false) {
        if (multiple) return this.deleteMultiple(params);
        else return this.deleteOne(params);
    }

    static deleteMultiple(params) {
        return this.remove(params);
    }

    static deleteOne(params) {
        return this.findOneAndRemove(params);
    }

    static ObjId(id, filter){
        if (id) id = (id instanceof Object) ? id : {_id : id};
        else id = {};
        return filter? Object.assign(filter, id) : id;    
    }
};