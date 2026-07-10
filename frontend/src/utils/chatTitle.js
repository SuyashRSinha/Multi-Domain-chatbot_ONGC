export function generateTitle(domain){

    const today = new Date();

    return `${domain.replace("_documents","")} ${today.toLocaleString()}`;

}