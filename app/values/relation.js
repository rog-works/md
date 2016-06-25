'use strict';

// get all
let all = () => {
  return rels;
};

// at once
let filter = (ids, key) => {
  return rels.filter((self) => {
    return ids.indexOf(self[key]) !== -1;
  });
};

let findByIds = (ids) => {
  return filter(ids, 'id');
};

let get = (id) => {
  return findByIds([id]).pop() || null;
};

let findByMDId = (md_id) => {
  return filter([md_id], 'md_id');
};

let findByTagId = (tagId) => {
  return filter([tagId], 'tag_id');
};

// create from relation pair id
let create = (tag_id, md_id) => {
  let v = {
    id: ++lastId,
    tag_id: tag_id,
    md_id: md_id
  };
  rels.push(v);
  return v;
};

 let batchCreate = (pairs) => {
   return pairs.map((self) => {
     return create(self.tag_id, self.md_id);
   });
 };

// destroy by ids
let batchDestroy = (ids) => {
  let len = rels.length;
  rels = rels.filter((self) => {
    return ids.indexOf(self.id) === -1;
  });
  return len - rels.length;
};

// destroy by id
let destroy = (id) => {
  return batchDestroy([id]);
};

let lastId = 2;
let rels = [
  {id: 1, tag_id: 1, md_id: 1},
  {id: 2, tag_id: 1, md_id: 2},
  {id: 3, tag_id: 2, md_id: 1}
  ];

module.exports = {
    all: all,
    get: get,
    findByIds: findByIds,
    findByMDId: findByMDId,
    findByTagId: findByTagId,
    create: create,
    batchCreate: batchCreate,
    destroy: destroy,
    batchDestroy: batchDestroy
  };