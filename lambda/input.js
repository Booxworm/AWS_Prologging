exports.handler = async function(event){
    console.log(JSON.stringify(event, undefined, 2));
    console.error(event.Records[0].body);
}