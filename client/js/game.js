import hello from "./hello";
import io from 'socket.io-client';

var socket = io();
hello();