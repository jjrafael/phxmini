export default ({book, onClick, date}) => {
    return (
        <div className="book-details"
            onClick={e => {
                if (onClick) { onClick(book) }
            }}
        ><span>{book.description}</span><span>{book.instance}</span><span>{date}</span>
        </div>
    )
}