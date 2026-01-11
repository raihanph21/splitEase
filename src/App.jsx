import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowFriend() {
    setShowAddFriends((e) => !e);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriends(false); //kan function buat nambah, jadi handleAddFriend ini selain menambah friend(mengubah state), ia juga menutup form AddFriend
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriends(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) => friends.map((friend) => (friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend)));

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} onSelection={handleSelection} selectedFriend={selectedFriend} />

        {showAddFriends && <AddFriends onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowFriend}>{showAddFriends ? "Close" : "Add friends"}</Button>
      </div>
      {selectedFriend && <SplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} key={selectedFriend.id} />}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <Friends friendObj={friend} onSelection={onSelection} selectedFriend={selectedFriend} key={friend.id} />
        ))}
      </ul>
    </div>
  );
}

function Friends({ friendObj, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friendObj.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendObj.image} alt={friendObj.name}></img>
      <h3>{friendObj.name}</h3>
      {friendObj.balance < 0 && (
        <p className="red">
          You owe {friendObj.name} {Math.abs(friendObj.balance)}€
        </p>
      )}
      {friendObj.balance > 0 && (
        <p className="green">
          {friendObj.name} owe you {Math.abs(friendObj.balance)}€
        </p>
      )}
      {friendObj.balance === 0 && <p>You and {friendObj.name} are even</p>}
      <Button onClick={() => onSelection(friendObj)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}

function AddFriends({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>🌇Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ selectedFriend, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const paidByFriend = billValue ? billValue - yourExpense : "";
  const [payTheBill, setPayTheBill] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!billValue || !yourExpense) return;
    onSplitBill(payTheBill === "user" ? paidByFriend : -yourExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>💰Bill value</label>
      <input type="text" value={billValue} onChange={(e) => setBillValue(Number(e.target.value))} />

      <label>🕴️Your expense</label>
      <input type="text" value={yourExpense} onChange={(e) => setYourExpense(Number(e.target.value) > billValue ? yourExpense : Number(e.target.value))} />

      <label>👯{selectedFriend.name}'s expense:</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑Who is paying the bill?</label>
      <select value={payTheBill} onChange={(e) => setPayTheBill(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
