const Album = require('../models/Album');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf'); 

const addImage = async (req,res)=>{

    console.log(req.files);
    const idAlbum = req.params.id;
    const album = await Album.findById(idAlbum);

    if(!req?.files?.image){
        req.flash('error','Aucun fichier mis en ligne');
        res.redirect(`/albums/${idAlbum}`);  
        return;
    }

 
    
    const image = req.files.image;
    const folderPath = path.join(__dirname, '../public/uploads/',idAlbum);
    const localpath = path.join(folderPath, image.name);  

    if (image.mimetype != 'image/jpeg' && image.mimetype != 'image/png' ){
        req.flash('error','Ajouter une image de type PNG ou JPEG');
        res.redirect(`/albums/${idAlbum}`);  
        return;
    }
    fs.mkdirSync(folderPath, {recursive:true});

 
    await req.files.image.mv(localpath)
    
    album.images.push(image.name);
    await album.save();
    res.redirect(`/albums/${idAlbum}`); 

    }
const createAlbumForm = (req, res)=>{
    res.render('new-album' ,{
        title : 'Nouvel Album',
        errors : req.flash('error'),
});
  };

  const createAlbum = async (req, res)=>{
    try{
        await Album.create(
            {
                title: req.body.albumTitle,               
            }
        );
        res.redirect('/');  
    } catch(err) {
        req.flash('error',"Erreur lors de la création de l'album");
        res.redirect('/albums/create')
    }
    };


const album = async (req, res)=>{
    try{    
    const album = await Album.findById(req.params.id);
    res.render('album' ,{
            title : `Mon album : ${album.title}`,  
            album ,
            errors: req.flash('error')        
            // images : album.image[];            
    })
    }catch(err){
        res.redirect('/404')
    }
}

const albums = async (req, res)=>{
    const albums = await Album.find();
    res.render('albums' ,{
            title : 'Mes albums',
            albums,
    })
}

const deleteImage = async (req, res)=>{
    const idAlbum = req.params.id;
    const imageIndex = req.params.imageIndex
    const album = await Album.findById(idAlbum);
    const image = album.images[imageIndex]

    if (!image){
        res.redirect(`/albums/${idAlbum}`);
        return;         
    }
    album.images.splice(imageIndex, 1);
    await album.save();
    const imagePath = path.join(__dirname, '../public/uploads', idAlbum, image)
    fs.unlinkSync(imagePath);

    res.redirect(`/albums/${idAlbum}`);

};

const deleteAlbum = async (req, res)=>{
    const idAlbum = req.params.id;
    const albumPath = path.join(__dirname, '../public/uploads', idAlbum)

    const album = await Album.findByIdAndDelete(idAlbum);
    rimraf(albumPath, ()=> {
        res.redirect('/albums/');
    })
   
};

  module.exports = { createAlbumForm,
                     createAlbum,
                     albums,
                     album,
                     addImage,
                     deleteImage,
                     deleteAlbum
                   };