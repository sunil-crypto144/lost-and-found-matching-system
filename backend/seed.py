import os
import sys
from datetime import datetime

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.db_models import User, UserRole, Item, ItemType, ItemStatus, Match
from app.api.v1.items import run_auto_matching_for_item

def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding admin users...")
        # Sunil Reddy Admin
        sunil_admin = db.query(User).filter_by(email="sunil.reddyk06@gmail.com").first()
        if not sunil_admin:
            sunil_admin = User(
                name="Sunil Reddy",
                email="sunil.reddyk06@gmail.com",
                password_hash=get_password_hash("prabhasstar01"),
                role=UserRole.ADMIN
            )
            db.add(sunil_admin)
        else:
            sunil_admin.role = UserRole.ADMIN
            sunil_admin.password_hash = get_password_hash("prabhasstar01")

        # Default system admin
        default_admin = db.query(User).filter_by(email="admin@lostfound.com").first()
        if not default_admin:
            default_admin = User(
                name="System Administrator",
                email="admin@lostfound.com",
                password_hash=get_password_hash("Password123!"),
                role=UserRole.ADMIN
            )
            db.add(default_admin)

        db.commit()

        if db.query(Item).count() == 0:
            print("Seeding initial Lost items...")
            lost1 = Item(
                reporter_name="Alice Smith",
                reporter_contact="alice@example.com / +1-555-0192",
                type=ItemType.LOST,
                name="Black Samsung Galaxy S23 Ultra",
                category="Electronics",
                brand="Samsung",
                color="Black",
                description="Black Samsung smartphone with a clear transparent case and small scratch on lower camera lens.",
                location="Central Park Library 2nd Floor",
                event_date="2026-08-10",
                event_time="14:30",
                status=ItemStatus.OPEN
            )
            lost2 = Item(
                reporter_name="Sarah Jenkins",
                reporter_contact="sarah.j@example.com",
                type=ItemType.LOST,
                name="Blue Nike Backpack",
                category="Bags",
                brand="Nike",
                color="Blue",
                description="Dark blue water-resistant Nike backpack containing blue umbrella and college notebooks.",
                location="Main Street Metro Station",
                event_date="2026-08-12",
                event_time="09:15",
                status=ItemStatus.OPEN
            )
            lost3 = Item(
                reporter_name="David Miller",
                reporter_contact="david.m@example.com",
                type=ItemType.LOST,
                name="Silver Apple MacBook Pro 14",
                category="Electronics",
                brand="Apple",
                color="Silver",
                description="Silver metallic laptop with React and Python stickers on the outer lid.",
                location="University Student Center",
                event_date="2026-08-14",
                event_time="18:00",
                status=ItemStatus.OPEN
            )

            db.add_all([lost1, lost2, lost3])
            db.commit()

            print("Seeding initial Found items and triggering matching engine...")
            found1 = Item(
                reporter_name="Bob Johnson",
                reporter_contact="bob@example.com / +1-555-0843",
                type=ItemType.FOUND,
                name="Black Samsung Phone",
                category="Electronics",
                brand="Samsung",
                color="Black",
                description="Black Samsung smartphone with clear protective cover found on study table near window.",
                location="Central Park Library 2nd Floor",
                event_date="2026-08-10",
                event_time="15:00",
                status=ItemStatus.OPEN
            )
            found2 = Item(
                reporter_name="Michael Scott",
                reporter_contact="michael.s@example.com",
                type=ItemType.FOUND,
                name="Navy Blue Nike Bag",
                category="Bags",
                brand="Nike",
                color="Blue",
                description="Navy blue Nike sports bag with notebooks found near ticketing counter.",
                location="Main Street Station Entrance",
                event_date="2026-08-13",
                event_time="10:00",
                status=ItemStatus.OPEN
            )

            db.add_all([found1, found2])
            db.commit()

            # Trigger matching
            run_auto_matching_for_item(found1, db)
            run_auto_matching_for_item(found2, db)

        print("Database admin accounts verified successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
