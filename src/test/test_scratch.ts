import List from "../core_libs/containers/list.js";
import Vector3 from "../core_libs/math/vectors/vector3.js";
import { readObject, writeObject } from "../core_libs/system/serialization/serialization.js";
import serializableTypeMgr from "../core_libs/system/serialization/serializable_type_manager.js";
import * as FileIO from "../core_libs/system/io/file.js"
import * as Strings from "../core_libs/utility/string.js";

import Character from "../engine/objects/characters/character.js";
import NavNetwork from "../engine/ai/pathfinding/nav_network/nav_network.js";
import NavNetworkNode from "../engine/ai/pathfinding/nav_network/nav_network_node.js";

(function() { /* Test module */

/*
  let navNode = new NavNetworkNode(new Vector3(20.0, 0.0, 10.0));
  let navBuffer = writeObject("navNode", navNode);
  console.log(JSON.stringify(navBuffer, undefined, 2));

  let recreatedNode = readObject("navNode", navBuffer);
  console.log(recreatedNode);
*/

/*
  serializableTypeMgr.registerType(Test1);
  serializableTypeMgr.registerType(Test2);
  BserializableTypeMgr.registerType(Test3);


  let testVar = new Test3();
  testVar.sub1 = 80085;
  let testVarBuffer = writeObject(testVar);
  console.log(JSON.stringify(testVarBuffer, undefined, 2));

  let newTestObj = readObject(testVarBuffer);
  console.log(newTestObj);

  let newTestObjBuffer = writeObject(newTestObj);
  console.log(JSON.stringify(newTestObjBuffer, undefined, 2));
 */

  console.log(Strings.format("Whoa {1} this works {0}", "thing1", "thing2"));


  let testList = new List();
  let obj1 = 15;
  let obj2 = 20;
  let obj3 = -5;
  testList.prepend(obj1);
  testList.prepend(obj2);
  testList.prepend(obj3);
  testList.forEach(function(element){
    console.log(element);
  });
  testList.remove(20);
  testList.forEach(function(element){
    console.log(element);
  });
  testList.remove(-5);
  testList.remove(7);
  testList.remove(15);
  testList.forEach(function(element){
    console.log(element);
  });

  let navNetwork = new NavNetwork();

  let asdfasdkfj = new Vector3();

  // Add some test data to the nav network
  let nodeArray = []
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(0.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(2.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(3.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(7.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(9.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(13.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(9.0, -1.5, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(9.0, -2.5, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(13.0, 2.5, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(7.0, -2.5, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(7.0, 2.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(5.0, 1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(5.0, 3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(3.0, 3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(1.0, 3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(1.0, 1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(3.0, 1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(2.0, -1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(2.0, -2.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(2.0, -3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(2.0, -4.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(3.0, -1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(3.0, -2.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(3.0, -3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(3.0, -4.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new NavNetworkNode(new Vector3(5.0, 0.0, 0.0))));

  navNetwork.linkNodes(nodeArray[0], nodeArray[1], true);
  navNetwork.linkNodes(nodeArray[1], nodeArray[17], true);
  navNetwork.linkNodes(nodeArray[17], nodeArray[18], true);
  navNetwork.linkNodes(nodeArray[18], nodeArray[19], true);
  navNetwork.linkNodes(nodeArray[19], nodeArray[20], true);
  navNetwork.linkNodes(nodeArray[1], nodeArray[2], true);
  navNetwork.linkNodes(nodeArray[2], nodeArray[21], true);
  navNetwork.linkNodes(nodeArray[21], nodeArray[22], true);
  navNetwork.linkNodes(nodeArray[22], nodeArray[23], true);
  navNetwork.linkNodes(nodeArray[23], nodeArray[24], true);
  navNetwork.linkNodes(nodeArray[2], nodeArray[25], true);
  navNetwork.linkNodes(nodeArray[25], nodeArray[11], true);
  navNetwork.linkNodes(nodeArray[11], nodeArray[12], true);
  navNetwork.linkNodes(nodeArray[12], nodeArray[13], true);
  navNetwork.linkNodes(nodeArray[13], nodeArray[14], true);
  navNetwork.linkNodes(nodeArray[14], nodeArray[15], true);
  navNetwork.linkNodes(nodeArray[15], nodeArray[16], true);
  navNetwork.linkNodes(nodeArray[25], nodeArray[3], true);
  navNetwork.linkNodes(nodeArray[3], nodeArray[10], true); 
  navNetwork.linkNodes(nodeArray[3], nodeArray[4], true);
  navNetwork.linkNodes(nodeArray[4], nodeArray[6], true);
  navNetwork.linkNodes(nodeArray[6], nodeArray[7], true);
  navNetwork.linkNodes(nodeArray[7], nodeArray[9], true);
  navNetwork.linkNodes(nodeArray[4], nodeArray[5], true);
  navNetwork.linkNodes(nodeArray[5], nodeArray[8], true);

  let path = navNetwork.findPath(0, 14);
  console.log(path);

  let navNetworkBuffer = writeObject(navNetwork);
  console.log(JSON.stringify(navNetworkBuffer, undefined, 2));

  let readNavMesh = readObject(navNetworkBuffer);
  console.log(readNavMesh);

// Resource Manager
/*
  console.log("----------------------------------");
  const handle = JJ.BE.Resources.resourceMgr.requestResource("data/nav_network/test_office_building_01.json", "text/json");
  const data = JJ.BE.Resources.resourceMgr.getData(handle);
  const myNavNetwork = readObject(JSON.parse(data));

  const handle2 = JJ.BE.Resources.resourceMgr.requestResource("data/nav_network/test_office_building_01.json", "text/json");
  JJ.BE.Resources.resourceMgr.releaseResource(handle);
  JJ.BE.Resources.resourceMgr.releaseResource(handle2);
  const fail = JJ.BE.Resources.resourceMgr.getData(handle);
  console.log(myNavNetwork);
  */

// File IO
/*
  JJ.System.IO.requestFileAsync("data/nav_network/test_office_building_01.json", function callback(success, filePath, data) {
    console.log("Success: " + success);
    console.log("File Path: " + filePath);
    console.log("Data: " );
    console.log(data);
  }, "text/json");
*/

/*
  // Create a nav network for the world
  this.gameWorld.setNavNetwork(navNetwork);

  let parser = new JJ.BE.AI.Pathfinding.NavNetworkSerializer("data/nav_network/test_nav_network.json");
  let parsedNavNetwork = parser.read();

  // Create a character for the world
  let character = new Character();
  let charController = new JJ.BE.Controllers.CharacterController();
  charController.attach(character);
  charController.setMoveDir(Vector3.FORWARD);
  charController.setMoveSpeed(5.0);

  let delayNode = new JJ.BE.AI.Behavior.BehaviorTreeDelayNode();
  console.log(JSON.stringify(delayNode, undefined, 2));

  this.gameWorld.addEntity(character);
  this.gameWorld.addController(charController);
  */


})();