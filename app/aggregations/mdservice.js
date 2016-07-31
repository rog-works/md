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
		Relation.create(mdId, tagId, callback);
	}

	static untagged (mdId, tagId, callback) {
		Relation.findByTagId(tagId, (rows) => {
			for (let row of rows) {
				if (row.mdId == mdId) {
					Relation.destroy(Number(row.id), (message) => { console.log(message); });
				}
			}
		});
		callback('OK');
	}

	static untaggedAll (tagId, callback) {
		Relation.findByTagId(tagId, (rows) => {
			for (let row of rows) {
				Relation.destroy(Number(row.id), (message) => { console.log(message); });
			}
		});
		Tag.destroy(tagId, callback);
	}

	static invalidate (mdId, callback) {
		Relation.findByMDId(mdId, (rows) => {
			for (let row of rows) {
				Relation.destroy(Number(row.id), (message) => { console.log(message); });
			}
		});
		MD.destroy(mdId, callback);
	}
}

module.exports = MDService;