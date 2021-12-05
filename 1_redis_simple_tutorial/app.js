const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Create Redis Client
let client = redis.createClient();

client.on('connect'     , () => console.log('connect'));
client.on('ready'       , () => console.log('ready'));
client.on('reconnecting', () => console.log('reconnecting'));
client.on('error'       , () => console.log('error'));
client.on('end'         , () => console.log('end'));

function printErrorOrResponse (err, value) {
    if(err) throw err;
    console.log(value);
};

function returnItem (err, item) {
    if(err) throw err;
    return item
}

// set : 첫 번째 인자(키), 두 번째 인자(값), 출력을 통해 Redis에 데이터 추가 (redis.print는 없어도 무방함)
// get : 첫 번째 인자(키), 두 번째 인자(함수의 첫 번째 인자(err), 두 번째 인자(값)을 통해 출력
client.set('Name', 'Richet', printErrorOrResponse)

client.get('Name', function(err, value){
    if(err) throw err;
    console.log(value);
});

client.get('Name?', function(err, value){
    if(err) throw err;
    console.log(value);
});


// HashTable
// hmset : 해시테이블에 key로 식별되는 value 값들을 항목으로 추가 가능. 첫 번째 인자(해시테이블명), 두 번째 인자들(항목들)
// hset : 해시테이블에 key로 식별되는 value 값들을 항목으로 추가. 단, hmset은 여러 개를 입력할 수 있지만 hset은 하나만 가능.
// hget : 해당 해시테이블에서, 인자로 받는 항목의 값을 가져옴. 첫 번째 인자(해시테이블명), 두 번째 인자(항목), 세 번째 인자 함수(첫 번째 인자(에러), 두 번째 인자(항목값))
// hkeys: 해당 해시테이블의 저장된 항목의 키값을 가져옴. 첫 번째 인자(해시테이블명), 두 번째 인자(함수(첫 번째 인자(에러), 두 번째 인자(항목의 키들))

//방법 1) hmset
client.hmset('richet', {
    'name' : 'Eun Taek Oh',
    'job' : 'software engineer'
}, redis.print);           

client.hget('richet', 'name', function(err,value) {            // richet hashmap에서 name 값 가져오기
    if(err) throw err;
    console.log('name is : ' + value);            // 해당 값 출력
});


client.hkeys('richet', function(err,keys) {            // richet의 해시테이블 모든 키 데이터 가져오기
    if(err) throw err;
    keys.forEach(function(key, i) {
        console.log('richet ' + i + ' : ' + key);
    });
});



//방법 2) hmset
client.hset('richet2', 'name', 'Richet Oh', redis.print);
client.hset(['richet2', 'job', 'consultant'], redis.print);             // 해시 테이블 추가 및 결과 출력

client.hget('richet2', 'name', function(err,value) {            // richet hashmap에서 name 값 가져오기
    if(err) throw err;
    console.log('name is : ' + value);            // 해당 값 출력
});


// List

// 리스트는 메모리가 허용하는 한 매우 많은 데이터를 저장할 수 있습니다.
// 리스트의 길이가 길어지면 검색 속도 또한 느려지게 됩니다.
// lpush : 리스트에 값 추가(첫 번째 인자(리스트명), 두 번째 인자(값), 세 번째 인자(출력))
// lrange : 리스트에 값 가져오기. (첫 번째 인자(리스트명), 두 번째 인자(시작지점), 세 번째 인자(마지막지점), 네 번째 인자(함수(첫 번째 인자(에러), 두 번째 인자)값))


client.lpush('tasks', 'Node.js');            // 리스트에 값 추가
client.lpush('tasks', 'Redis');
lists = client.lrange('tasks', 0, -1, function(err, items){            // 시작, 종료인자 이용해 리스트 항목 가져오기
      // -1는 리스트의 마지막 항목 의미, 즉 다 가져오기
    var jobs = []
    if(err) throw err; items.forEach(function(item, i){
        jobs.push(item)
        console.log('list ' + i + ' : ' + item); });
    return jobs
    }
    
);


// Increment 
// user id그냥 자동으로 increment해서 생성해주고 싶을 때 이런식으로 사용하면됨.
var name = 'Richet';
client.incr('id', function(err, id) {
    console.log("setting ", 'user:' + id, 'username', name)
    client.hmset('user:' + id, 'username', name);
});

client.hget('user:5', 'username', function(err,value) {            // richet hashmap에서 name 값 가져오기
    if(err) throw err;
    console.log('name is : ' + value);            // 해당 값 출력
});

client.get('id', function(err, id) {
    console.log("id key is", id);
    return id
});

