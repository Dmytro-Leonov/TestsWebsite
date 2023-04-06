from tests_website.subscriptions.models import Subscription
from tests_website.subscriptions.services import subscription_create_default

from tests_website.common.utils import get_object


def subscription_get_default() -> Subscription:
    default_subscription = get_object(Subscription, is_default=True)

    if default_subscription:
        return default_subscription

    default_subscription = subscription_create_default()
    return default_subscription
