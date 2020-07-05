const Notes = require('../src/models/Notes');
const User = require('../src/models/User');

module.exports = {
    popularNotesList:async function(){
        var rating =0;
        var passingvalue = [];
        const popularNotes = await Notes.find();
        popularNotes.forEach((note)=>{
            var sum =0;
            if(note.ratings.length==0){
                passingvalue.push({rate:0,branch:note.branch,semester:note.semester,subject:note.subject});
            }else{
                note.ratings.forEach((rate)=> {
                    sum += rate.rating;
                })
                passingvalue.push({rate:sum/note.ratings.length,branch:note.branch,semester:note.semester,subject:note.subject});
            }
        })
        return (passingvalue.sort((a,b) => (a.rate > b.rate) ? 1 : -1).reverse().slice(0,5));
    },
    mostDownloadedNotes:async function(){
        const mostDownloaded = await Notes.find().sort({downloadCount:'desc'}).limit(5);
        return mostDownloaded
    },
    popularProfiles: async function(){
        const popularProfile = await User.find().sort({profileViewCount:'desc'}).limit(5);
        return popularProfile;
    },
    recentUploads: async function(){
        const recentNotes = await Notes.find().sort({timeStamp:'desc'}).limit(5);
        return recentNotes;
    }
}