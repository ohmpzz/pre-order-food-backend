export class GenSlugUrl {
  slug(id, title) {
    const slug = title.replace(/\s/g, '-') + `-${id}`;

    return slug;
  }
}

export default new GenSlugUrl();
