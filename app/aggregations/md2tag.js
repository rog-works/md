'use strict';

const MD = require('../entities/md');
const Tag = require('../entities/tag');
const Relation = require('../values/relation');

class MD2Tag {
	constructor () {
	}

	findTagsByMDId (mdId, callback) {
		(new Relation()).findByMDId(mdId, (rels) => {
			let tagIds = rels.map((self) => {
				return self.tagId;
			});
			(new Tag()).findByIds(tagIds, callback);
		});
	}

	findMDsByTagId (tagId, callback) {
		(new Relation()).findByTagId(tagId, (rels) => {
			let mdIds = rels.map((self) => {
				return self.mdId;
			});
			(new MD()).findByIds(mdIds, callback);
		});
	}
}

module.exports = MD2Tag;