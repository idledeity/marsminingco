import assert from "../../../../core_libs/system/assert.js";

/**
 * Stores an address of a MeshNetworkNode
 */
export default class MeshNetworkAddress {
  public static readonly AddressSize = 4;
  private address: Uint8Array;

  /**
   * Constructor for MeshNetworkAddress, accepts the following argument lists
   * MeshNetworkAddress(addressString):
   * MeshNetworkAddress(meshNetworkAddress);
   */
  constructor() {
    this.setAddress.apply(this, arguments);
  }

  /**
   * Returns the address as an Uint8 array of sub-values
   * @return {Uint8Array} Returns the address
   */
  getAddress() {
    return this.address;
  }

  /**
   * Sets the stored address
   * Accepts the following argument patterns:
   *  MeshNetworkAddress(addressString);      // string
   *  MeshNetworkAddress(meshNetworkAddress); // MeshNetworkAddress reference
   *  MeshNetworkAddress(byteValue, ...);     // Argument list of byte values
   * @return {boolean} True if the operation succedded, False if there was an error
   */
  setAddress() {
    if (arguments.length == 1) {
      // If the argument is another MeshNetworkAddress, copy it's address data
      if (arguments[0] instanceof MeshNetworkAddress) {
        // Loop over each byte and copy it
        for (let byteIndex = 0; byteIndex < this.address.length; byteIndex++) {
          this.address[byteIndex] = arguments[0].getAddress()[byteIndex];
        }
      } else if (typeof arguments[0] === "string") {
        // If the argument is a string, parse it for the address

        // Split the string argument into strings for each address sub-value
        let subValueStrings = arguments[0].split(".");

        // Verify the correct number of sub-values were found
        if (!assert((subValueStrings.length == MeshNetworkAddress.AddressSize),
          "Unexpected string format, should be xxx.xxx.xxx.xxx (ex: 192.168.0.1).")) {
          return false;
        }

        // Create a new byte array to store the new address
        let newAddress = new Uint8Array(MeshNetworkAddress.AddressSize);

        // Convert the string values into bytes
        for (let valueIndex = 0; valueIndex < newAddress.length; valueIndex++) {
          // Convert the value string into a number
          let valueNumber = parseInt(subValueStrings[valueIndex]);
          if (!assert(((valueNumber >= 0) && (valueNumber < 256)),
            "Address value range must be between [0-255]")) {
            return false;
          }

          newAddress[valueIndex] = valueNumber;
        }

        // Store the new address
        this.address = newAddress;
      }
    } else if (arguments.length == 4) {
        // Create a new byte array to store the new address
        let newAddress = new Uint8Array(MeshNetworkAddress.AddressSize);

        // Convert the string values into bytes
        for (let argumentIndex = 0; argumentIndex < newAddress.length; argumentIndex++) {
          // Convert the value string into a number
          let valueNumber = arguments[argumentIndex];
          if (!assert(((valueNumber >= 0) && (valueNumber < 256)),
            "Address value range must be between [0-255]")) {
            return false;
          }

          newAddress[argumentIndex] = valueNumber;
        }

        // Store the new address
        this.address = newAddress;
    }

    return true;
  }

  /**
   * Returns a single sub value of the address as the index specified
   * @param {number} index - Index of the address sub-value to return
   * @return {number} The value of the address at the index
   */
  getAddressSubValue(index: number) {
    assert(((index >= 0) && (index < this.address.length)), "Index out of bounds.");
    return this.address[index];
  }
}
