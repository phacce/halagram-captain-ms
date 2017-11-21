/**
 * This mocks a model. For simplicity, it uses ONLY ids to find items from the store
 * this implies that all valid objects MUST contain an id property
 */

module.exports = class FakeDataSource {

	constructor(name){
        this.name = name;
        this.collection = [];
	}

    /**
     * Object must contain an id param
     * ex. { id : 1, ... }
     * @param {*Object} obj the object to insert
     */
    create(obj) {
        this.collection.push(obj);
        return Promise.resolve(obj);
    }

    findOne(params, projection) {
        return new Promise((resolve, reject) => {
            this.collection.forEach((item) => {
                if (item.id == params.id) {
                    resolve(item);
                }
            });
            reject('Item not found');
        });
    }

    /**
     * For simplicity, uses the 'category' parameter to find items
     * @param {Object} params the filter object
     * @param {Object} projection the projection to fetch; not used in this case
     */
    find(params, projection) {
        return new Promise((resolve, reject) => {
            let temp = [];
            this.collection.forEach((item) => {
                if (item.category == params.category) {
                    temp.push(item);
                }
            });
            if (temp.length == 0) reject('No item found');
            else resolve(temp);
        });
    }

	update(params, newObj) {
		this.collection.forEach((item) => {
            if (item.id == params.id) {
                for (let x in newObj) {
                    item[x] = newObj[x];
                }
            }
        });
        return this.findOne(params, null);
	}

    remove(params) {
        return new Promise((resolve, reject) => {
            this.collection.forEach((item) => {
                if (item.id == params.id) {
                    let removed = this.collection.pop(item);
                    resolve(removed);
                }
            });
            reject('Item not found');
        });
    }
};