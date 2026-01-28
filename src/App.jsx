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
    <button
      className="button border-2 my-2 p-1 border-violet-500 rounded-sm"
      onClick={onClick}
    >
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
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend,
      ),
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app w-full p-5">
      <div className="head sticky p-5 text-center text-transparent bg-clip-text bg-linear-to-br from-indigo-500 via-purple-600 to-pink-300 font-bold text-3xl shadow-xl mt-5 rounded-md border-2 border-violet-500">
        Split Ease
      </div>
      <div className="sidebar p-5 mt-10 shadow-md border-2 border-violet-500 rounded-md bg-violet-50">
        <div className="mb-5 text-center text-2xl font-bold ">Friends</div>
        <div className="">
          <FriendList
            friends={friends}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
          />
        </div>
      </div>
      {showAddFriends && <AddFriends onAddFriend={handleAddFriend} />}
      <div className="*:w-full">
        <Button onClick={handleShowFriend}>
          {showAddFriends ? "Close" : "Add friends"}
        </Button>
      </div>
      {selectedFriend && (
        <SplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <div>
      <ul>
        {friends.map((friend) => (
          <Friends
            friendObj={friend}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
            key={friend.id}
          />
        ))}
      </ul>
    </div>
  );
}

function Friends({ friendObj, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friendObj.id;
  return (
    <li className='mt-4 {isSelected ? "selected" : ""}'>
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
      <Button onClick={() => onSelection(friendObj)}>
        {isSelected ? "Close" : "Select"}
      </Button>
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
    <form
      className="form-add-friend border-2 mt-2 rounded-md border-violet-500 bg-violet-50 p-3 flex flex-col *:p-1"
      onSubmit={handleSubmit}
    >
      <label>🧑‍🤝‍🧑Friend</label>
      <input
        placeholder="your friend's name..."
        className="border rounded-sm"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌇Image URL</label>
      <input
        className="border rounded-sm"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
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
    <form
      className="form-split-bill mt-3 border-2 shadow-2xl bg-violet-50 border-violet-500 rounded-md p-3 flex flex-col [&_input]:border [&_input]:border-violet-500 *:mt-1"
      onSubmit={handleSubmit}
    >
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />

      <label>🕴️Your expense</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) =>
          setYourExpense(
            Number(e.target.value) > billValue
              ? yourExpense
              : Number(e.target.value),
          )
        }
      />

      <label>👯{selectedFriend.name}'s expense:</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑Who is paying the bill?</label>
      <select
        className="w-fit"
        value={payTheBill}
        onChange={(e) => setPayTheBill(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
