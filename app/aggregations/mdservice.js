'use strict';

const MD = require('../entities/md');
const Tag = require('../entities/tag');
const Relation = require('../values/relation');

class MDService {
	static get (mdId, callback) {
		MD.get(mdId, (row) => {
			if (row === null) {
				callback(null);
			} else {
				MDService.findTags(mdId, (tags) => {
					row.tags = tags;
					callback(row);
				});
			}
		});
	}

	static getTag (tagId, callback) {
		Tag.get(tagId, (row) => {
			if (row === null) {
				callback(null);
			} else {
				MDService.findMDs(tagId, (mds) => {
					row.mds = mds;
					callback(row);
				});
			}
		});
	}

	static findTags (mdId, callback) {
		Relation.findByMDId(mdId, (rels) => {
			let tagIds = rels.map((self) => {
				return Number(self.tagId);
			});
			Tag.findByIds(tagIds, callback);
		});
	}

	static findMDs (tagId, callback) {
		Relation.findByTagId(tagId, (rels) => {
			let mdIds = rels.map((self) => {
				return Number(self.mdId);
			});
			MD.findByIds(mdIds, callback);
		});
	}

	static tagged (mdId, tagId, callback) {
		MDService.findTags(mdId, (tags) => {
			const exists = tags.filter((self) => {
				return self.id === tagId;
			});
			if (exists.length === 0) {
				Relation.create(mdId, tagId, callback);
			} else {
				console.log('Already relation exists. mdId=' + mdId + ' tagId=' + tagId);
				// callback(null);
				callback(exists.pop());
			}
		});
	}

	static untagged (mdId, tagId, callback) {
		Relation.findByTagId(tagId, (rows) => {
			const ids = rows.map((self) => { return self.id; });
			const destroy = (id) => {
				Relation.destroy(Number(id), (id) => {
					if (ids.length > 0) {
						destroy(ids.shift());
					} else {
						callback(rows);
					}
				});
			};
			destroy(ids.shift());
		});
	}

	static untaggedAll (tagId, callback) {
		Relation.findByTagId(tagId, (rows) => {
			for (let row of rows) {
				Relation.destroy(Number(row.id), (id) => { console.log(id); });
			}
		});
		Tag.destroy(tagId, callback);
	}

	static invalidate (mdId, callback) {
		Relation.findByMDId(mdId, (rows) => {
			for (let row of rows) {
				Relation.destroy(Number(row.id), (id) => { console.log(id); });
			}
		});
		MD.destroy(mdId, callback);
	}
}

module.exports = MDService;