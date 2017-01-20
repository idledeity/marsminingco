(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (Test, undefined) { /* Test module */


  class Test1 extends JJ.System.Serialization.Serializable{
    constructor() {
      super();

      this.x = 10;
    }

    static getSerializationId() {
      return "Test1";
    }

    serialize(serializeContext) {
      super.serialize(serializeContext);

      this.x = JJ.System.Serialization.serialize(serializeContext, this.x, "x");
    }
  }

  class Test2 extends JJ.System.Serialization.Serializable {
    constructor() {
      super();

      this.test1 = new Test1();
    }

    setTest(test) {
      this.test1 = test;
    }

    static getSerializationId() {
      return "Test2";
    }

    serialize(serializeContext) {
      super.serialize(serializeContext);

      this.test1 = JJ.System.Serialization.serialize(serializeContext, this.test1, "test1");
    }
  }

  class Test3 extends Test2 {
    constructor() {
      super();

      this.sub1 = 10;
      this.sub2 = 20;
      this.sub3 = { x: 15, y: 20, z: 25 };
    }

    static getSerializationId() {
      return "Test3";
    }

    serialize(serializeContext) {
      super.serialize(serializeContext);

      this.sub1 = JJ.System.Serialization.serialize(serializeContext, this.sub1, "sub1");
      this.sub2 = JJ.System.Serialization.serialize(serializeContext, this.sub2, "sub2");
      this.sub3 = JJ.System.Serialization.serialize(serializeContext, this.sub3, "differentString");
    }
  }



/*
  let navNode = new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(20.0, 0.0, 10.0));
  let navBuffer = JJ.System.Serialization.writeObject("navNode", navNode);
  console.log(JSON.stringify(navBuffer, undefined, 2));

  let recreatedNode = JJ.System.Serialization.readObject("navNode", navBuffer);
  console.log(recreatedNode);
*/

  JJ.System.Serialization.serializableTypeMgr.registerType(Test1);
  JJ.System.Serialization.serializableTypeMgr.registerType(Test2);
  JJ.System.Serialization.serializableTypeMgr.registerType(Test3);

  let testVar = new Test3();
  testVar.sub1 = 80085;
  let testVarBuffer = JJ.System.Serialization.writeObject(testVar);
  console.log(JSON.stringify(testVarBuffer, undefined, 2));

  let newTestObj = JJ.System.Serialization.readObject(testVarBuffer);
  console.log(newTestObj);

  let newTestObjBuffer = JJ.System.Serialization.writeObject(newTestObj);
  console.log(JSON.stringify(newTestObjBuffer, undefined, 2));

  console.log(JJ.Utility.String.format("Whoa {1} this works {0}", "thing1", "thing2"));


  let testList = new JJ.Containers.List();
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

  let navNetwork = new JJ.BE.AI.Pathfinding.NavNetwork();

  // Add some test data to the nav network
  let nodeArray = []
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(0.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(2.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(3.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(7.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(9.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(13.0, 0.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(9.0, -1.5, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(9.0, -2.5, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(13.0, 2.5, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(7.0, -2.5, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(7.0, 2.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(5.0, 1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(5.0, 3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(3.0, 3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(1.0, 3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(1.0, 1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(3.0, 1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(2.0, -1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(2.0, -2.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(2.0, -3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(2.0, -4.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(3.0, -1.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(3.0, -2.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(3.0, -3.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(3.0, -4.0, 0.0))));
  nodeArray.push(navNetwork.addNode(new JJ.BE.AI.Pathfinding.NavNetworkNode(new JJ.Math.Vector3(5.0, 0.0, 0.0))));

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

  let navNetworkBuffer = JJ.System.Serialization.writeObject(navNetwork);
  console.log(JSON.stringify(navNetworkBuffer, undefined, 2));

  let readNavMesh = JJ.System.Serialization.readObject(navNetworkBuffer);
  console.log(readNavMesh);

// Resource Manager
/*
  console.log("----------------------------------");
  const handle = JJ.BE.Resources.resourceMgr.requestResource("data/nav_network/test_office_building_01.json", "text/json");
  const data = JJ.BE.Resources.resourceMgr.getData(handle);
  const myNavNetwork = JJ.System.Serialization.readObject(JSON.parse(data));

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
  let character = new JJ.BE.Objects.Character();
  let charController = new JJ.BE.Controllers.CharacterController();
  charController.attach(character);
  charController.setMoveDir(JJ.Math.vector3Forward);
  charController.setMoveSpeed(5.0);

  let delayNode = new JJ.BE.AI.Behavior.BehaviorTreeDelayNode();
  console.log(JSON.stringify(delayNode, undefined, 2));

  this.gameWorld.addEntity(character);
  this.gameWorld.addController(charController);
  */


}(window.JJ.Test = window.JJ.Test || {}));
}(window.JJ = window.JJ || {}));