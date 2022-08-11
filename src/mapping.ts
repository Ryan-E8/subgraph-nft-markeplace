import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemListed, ActiveItem, ItemBought, ItemCanceled } from "../generated/schema"


export function handleItemBought(event: ItemBoughtEvent): void {
  // Save that event in our graph
  // update our activeitems

  // get or create an itemlisted object
  // each item needs a unique Id

  // ItemBoughtEvent: Just the raw event
  // ItemBoughtObject: What we save

  // We load it's unique ID, pass in the tokenId and nftAddress
  // These will have the same ID, but they are across different types so its fine (ItemBought/ActiveItem)
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  // If there is no itemBought, we will create a new ItemBought and update its parameters
  if (!itemBought) {
    itemBought = new ItemBought(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  // Whenever someone buys an item, we update a new itemBought object, and update our activeItem to a new buyer
    itemBought.buyer = event.params.buyer
    itemBought.nftAddress = event.params.nftAddress
    itemBought.tokenId = event.params.tokenId
    // ! means we will have an item (typescript thing)
    activeItem!.buyer = event.params.buyer

    itemBought.save()
    activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  // see if our ItemListed and ActiveItem exists
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
)
let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
)
// if it doesnt exist then create a new one
if (!itemListed) {
    itemListed = new ItemListed(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
}
// if it doesnt exist then create a new one
if (!activeItem) {
    activeItem = new ActiveItem(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
}
// update our objects
itemListed.seller = event.params.seller
activeItem.seller = event.params.seller

itemListed.nftAddress = event.params.nftAddress
activeItem.nftAddress = event.params.nftAddress

itemListed.tokenId = event.params.tokenId
activeItem.tokenId = event.params.tokenId

itemListed.price = event.params.price
activeItem.price = event.params.price

activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")

// Save our objects
itemListed.save()
activeItem.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  // if they items exits then grab them
  let itemCanceled = ItemCanceled.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
)
let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
)
// if not itemCanceled then make new one
if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
}
// set the object values
itemCanceled.seller = event.params.seller
itemCanceled.nftAddress = event.params.nftAddress
itemCanceled.tokenId = event.params.tokenId
// Giving it the dead address, if we have the dead address as the buyer, then the item has been canceled
activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

// Save our objects
itemCanceled.save()
activeItem!.save()
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
}
