
const createDatabase = {text:'CREATE DATABASE "toDoDbtest" WITH OWNER = postgres ENCODING ="UTF8" CONNECTION LIMIT = -1 '};
const CreateTable = {text : 'CREATE TABLE public."toDoDbtest"() WITH ( OIDS = FALSE)'};
const ownerQery = {text:'ALTER TABLE public."toDoDbtest" OWNER to postgres'};


const columnId = {text:'ALTER TABLE public."toDoDbtest" ADD COLUMN id serial PRIMARY KEY'};
const columnTask ={text: 'ALTER TABLE public."toDoDbtest" ADD COLUMN task character(255);'};
const columnDesc ={text: 'ALTER TABLE public."toDoDbtest" ADD COLUMN description text;'};
const columnDir ={text: 'ALTER TABLE public."toDoDbtest" ADD COLUMN directions text;'};


module.exports = { createDatabase, CreateTable, ownerQery, ownerQery, columnId, columnTask, columnDesc, columnDir };