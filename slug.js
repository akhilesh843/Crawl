function createSlug(name) {
    // Convert to lowercase
    let slug = name.toLowerCase();
    
    // Replace spaces with hyphens
    slug = slug.replace(/\s+/g, '-');
    
    // Remove special characters
    slug = slug.replace(/[^\w\-]+/g, '');
    
    // Remove multiple hyphens
    slug = slug.replace(/\-\-+/g, '-');
    
    // Trim hyphens from the start and end
    slug = slug.replace(/^-+/, '').replace(/-+$/, '');
    
    return slug;
}

module.exports=createSlug;