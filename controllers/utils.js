function formatDate(date){
    let d = date.toISOString().split('T')[0];
    let d2 = d.split('-');
    let day = d2[2];
    let month = d2[1];
    let year = d2[0];
    return `${day}.${month}.${year}`;
}

function reformatDate(date){
    let d = date.split('T')[0];
    return d;
}

module.exports = {
    formatDate,
    reformatDate
}