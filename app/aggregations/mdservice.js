'use strict';

const MD = require('../entities/md');
const Tag = require('../entities/tag');
const Relation = require('../values/relation');

class MDService {
	static findTags (mdId, callback) {
		Relation.findByMDId(mdId, (rels) => {
			let tagIds = rels.map((self) => {
				return self.tagId;
			});
			Tag.findByIds(tagIds, callback);
		});
	}

	static findMDs (tagId, callback) {
		Relation.findByTagId(tagId, (rels) => {
			let mdIds = rels.map((self) => {
				return self.mdId;
			});
			MD.findByIds(mdIds, callback);
		});
	}

	static tagged (tagId, mdId, callback) {
		Relation.create(mdId, tagId, callback);
	}

	static untagged (tagId, mdId, callback) {
		Relation.findByTagId(tagId, (rows) => {
			for (let row of rows) {
				if (row.mdId == mdId) {
					Relation.destroy(row.id, (message) => { console.log(message); });
				}
			}
		});
		callback('OK');
	}

	static untaggedAll (tagId, callback) {
		Relation.findByTagId(tagId, (rows) => {
			for (let row of rows) {
				Relation.destroy(row.id, (message) => { console.log(message); });
			}
		});
		Tag.destroy(tagId, callback);
	}

	static invalidate (mdId, callback) {
		Relation.findByMDId(mdId, (rows) => {
			for (let row of rows) {
				Relation.destroy(row.id, (message) => { console.log(message); });
			}
		});
		MD.destroy(mdId, callback);
	}
}

module.exports = MD2Tag;