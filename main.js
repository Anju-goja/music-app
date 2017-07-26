
function fancyTimeFormat(time)
{   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
 
           

function updateCurrentTime() {
    var song = document.querySelector('audio');
    var currentTime = Math.floor(song.currentTime);
    var duration = Math.floor(song.duration);
    var bar=(currentTime*100)/duration;
    currentTime = fancyTimeFormat(currentTime);
    duration = fancyTimeFormat(duration)
    $('.time-elapsed').text(currentTime);
    $('.song-duration').text(duration);
    Progressbar(bar);
}
 //progressbar
function Progressbar(bar){
          var prog = document.querySelector('.progress-filled');
          prog.style.width= bar +"%";//final width css
        }
        $('.player-progress').click(function(event){
            var $this=$(this);
            var selectedLength= event.pageX-$this.offset().left;//jitni length se song play krna h
            var totalLength=$this.width();//song ka total span
            var width=(selectedLength/totalLength)*100;
            var song=document.querySelector('audio');
            song.currentTime=(song.duration*width)/100;
        });       
                  

var songs = [{
    'name': 'Tum sath ho (Title Track)',
    'artist': 'Alka yagnik, Arjit singh',
    'album': 'Tamasha',
    'duration': '5:40',
   'fileName': 'song1.mp3',
    'image': 'song1.jpg'

},
{
    'name': 'Soch na sake',
    'artist': 'Amaal Mallik, Tulsi Kumar & Arijit Singh',
    'album': 'Airlift',
    'duration': '4:41',
    'fileName': 'song2.mp3',
    'image': 'song2.jpg'
},
{
    'name': 'Nashe Si Chadh Gayi',
    'artist': 'Arijit Singh',
    'album': 'Befikre',
    'duration': '2:34',
    'fileName': 'song3.mp3',
    'image': 'song3.jpg'
},
{
    'name': 'The Breakup Song',
    'artist': 'Nakash Aziz, Arijit Singh, Badshah, Jonita Gandhi',
    'album': 'Ae Dil Hai Mushkil',
    'duration': '2:29',
    'fileName': 'song4.mp3',
    'image': 'song4.jpg'
},
 {
    'name': 'Humma humma song',
    'artist': 'Badshah, A.R rehman',
    'album': 'Ok jannu',
    'duration': '3:40',
   'fileName': 'song5.mp3',
   'image': 'song5.jpg'
},
  {
    'name': 'Mai woh chand',
    'artist': 'Darshan raval',
    'album': 'Tera surror',
    'duration': '5:21',
    'fileName': 'song6.mp3',
    'image': 'song6.jpg'
},
            {
    'name': 'ladki beautiful kar gyichul',
    'artist': 'Badshah, Fazilpuria, Sukriti Kakkar, Neha Kakkar',
    'album': 'kapoor and sons',
    'duration': '3:07',
    'fileName': 'song7.mp3',
    'image': 'song7.jpg'
}     
];

function changeCurrentSongDetails(songObj) {
    $('.current-song-image').attr('src','img/' + songObj.image)
    $('.current-song-name').text(songObj.name)
    $('.current-song-album').text(songObj.album)
}

function addSongNameClickEvent(songObj,position) {
    var songName =songObj.fileName;// new variable
    var id = '#song' + position;
    
    $(id).click(function() {
        var audio = document.querySelector('audio');
        var currentSong = audio.src;
        if(currentSong.search(songName) != -1)
        {
            toggleSong();
        }
        else {
            audio.src = songName;
            toggleSong();
            changeCurrentSongDetails(songObj); // Function Call
        }
    });
}

                         
               // songs play list....

                  

window.onload = function() {
    
    changeCurrentSongDetails(songs[0]); 

      //   for (var i = 0; i < fileNames.length ; i++) {
// addSongNameClickEvent(fileNames[i],i+1)
//    } 
    
  for(var i =0; i < songs.length;i++) {
    var obj = songs[i];
    var name = '#song' + (i+1);
    var song = $(name);
    song.find('.song-name').text(obj.name);
    song.find('.song-artist').text(obj.artist);
    song.find('.song-album').text(obj.album);
    song.find('.song-length').text(obj.duration);
    addSongNameClickEvent(obj,i+1);
  }

    updateCurrentTime(); 
    setInterval(function() {
        updateCurrentTime();
    },1000);
 $('#songs').DataTable({
        paging: false
  });
//    
//     Progressbar(bar);
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(200);

  var svgHeight = '400';
  var svgWidth = '1000';
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('.visualizer', svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding);

  // Continuously loop and update chart with frequency data.
  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);

     // Update d3 chart with new data.
     svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
           return svgHeight - d;
        })
        .attr('height', function(d) {
           return d;
        })
        .attr('fill', function(d) {
           return 'rgb(0, ' + d + ', 0)';
        });
  }

  // Run the loop
  renderChart();

}


 
// function2.....
        
function toggleSong() {

    var song = document.querySelector('audio');
    
    if(song.paused == true) {
        console.log('Playing');
        $('.play-icon').removeClass('fa-play').addClass('fa-pause');
            song.play();
    }
    else {
        console.log('Pausing');
        $('.play-icon').removeClass('fa-pause').addClass('fa-play');
        song.pause();
    }
}
        
$('.welcome-screen button').on('click', function() {
    
    var name = $('#name-input').val();
    
    if (name.length > 2) {
        var message = "Hello, " + name;
        $('.main .user-name').text(message);
        $('.welcome-screen').addClass('hidden');
        $('.main').removeClass('hidden');
    } else {
        $('#name-input').addClass('error');
    }
});
        
// click event...

$('.play-icon').on('click', function() {
   toggleSong();
});

$('.fa-repeat').on('click', function() {
   
    $('.fa-repeat').toggleClass('disabled')
    willLoop = 1 - willLoop;

});
$('.fa-random').on('click', function() {
   toggleSong();
});
$('.fa-backward').on('click', function() {
   toggleSong();
});
$('.fa-forward').on('click', function() {
   toggleSong();
});






$('.fa-bar-chart').on('click', function() {
    
    
        $('.dataTables_wrapper').addClass('hidden');
        $('.visualizer').removeClass('hidden');
        

});

$('.fa-music').on('click', function() {
    
    
        $('.dataTables_wrapper').removeClass('hidden');
        $('.visualizer').addClass('hidden');
        

});
